/*https://github.com/shubhvjain/angular-mathjax*/

import { Component, OnInit, Input, OnChanges, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { globals } from '../../globals';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'mathjax',
  templateUrl: './mathjax.component.html',
  styleUrls: ['./mathjax.component.css'],
  host: { '[class.loader]': 'showLoader' },
  encapsulation: ViewEncapsulation.None
})
export class MathjaxComponent implements OnChanges, OnInit {
  @Input() content: string;
  @Input() changeDirection: number = 0;
  preparedContent: string;
  typesetting: boolean = false;
  showLoader: boolean = false;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content']) {
      this.hideContent();
      //this.prepareContent();
      //this.renderMath()
    }
  }

  ngOnInit() {
    this.loadMathConfig()
    //this.hideContent();
    //this.renderMath();
  }

  hideContent() {
    this.typesetting = true;
    this.showLoader = true;

    if (this.changeDirection == 0) {
      this.prepareContent();
      this.renderMath();
      setTimeout(() => {
        this.typesetting = false;
        setTimeout(() => {
          this.showLoader = false;
        }, 300);
      }, 250);
    } else {
      this.changeDirection = -this.changeDirection;
      setTimeout(() => {
        this.changeDirection = -this.changeDirection;
        this.prepareContent();
        this.renderMath()
        setTimeout(() => {
          this.typesetting = false;
          setTimeout(() => {
            this.showLoader = false;
          }, 300);
        }, 250);
      }, 250);
    }
  }

  prepareContent() {
    this.preparedContent = "";

    let terms = this
      .content
      .replace(/\\\\\[.*?\]/g, "\\\\")
      .split(/(\$\$|\$|\\\[|\\\]|\\\(|\\\)|\\begin|\\end)/);
    let inmath = false;
    let beginCount = 0;

    for (let t of terms) {

      if (t == "\\begin") {
        beginCount++;
      } else if (t == "\\end") {
        beginCount--;
      } else if (t == "$$" || t == "$" || t == "\\[" || t == "\\]" || t == "\\(" || t == "\\)") {
        inmath = !inmath;
      } else if (!inmath && beginCount == 0) {
        t = t
          .replace(/\\\\|\\(small|med|big)skip|\\newline|\\vspace{.*?}|\n\n|\r\n\r\n/g, "<br/>")
          .replace(/\\q+uad|~|\\hspace{.*?}|\\hfill/g, "&nbsp;")
          .replace(/\\noindent/g, "");
      } else {
        t = t
          .replace(new RegExp(/</, 'g'), "< ");
      }
      this.preparedContent += t;
    }

    while (this.preprocessLaTeXTextStyle()) {

    };

    this.preprocessLaTeXEnums();
    this.preprocessTabular2Array();
    this.preprocessFigure();
    this.preprocessIncludegraphics();

  }

  private preprocessLaTeXEnums() {
    this.preparedContent = this
      .preparedContent
      .replace(/\\begin{(enumerate|itemize)}([^]*?)\\end{\1}/g, (m, p1, p2) => {
        return "<ul class=\"" + p1 + "\">" + p2.replace(/\\item(?:\[(.*?)\])?([^]*?)(?=(?:\\item|$))/g, (m, p1, p2) => {
          return p1 ? "<li class=\"hasorder\">" + p1 + p2 + "</li>" : "<li>" + p2 + "</li>";
        }) + "</ul>";
    });
  }

  private preprocessTabular2Array() {
    this.preparedContent = this
      .preparedContent
      .replace(/\\begin{tabular}({.*?})([^]*?)\\end{tabular}/g, (m, p1, p2) => {
        return "\\begin{array}" + p1 +
          (p2 as string).split(/(&|\\\\)/).map(function (s: string) {
            if (s == "&" || s == "\\\\") {
              return s;
            } else {
              return "\\text{" + s + "}"
            }
          }).join("")
          + "\\end{array}";
      });
  }

  private preprocessFigure() {
    this.preparedContent = this
      .preparedContent
      .replace(/\\begin{figure}(?:\[.*?\])?([^]*?)\\end{figure}/g, (m, p) => {

        let mm = p.match(/\\includegraphics(?:\[(.*?)\])?{(.*?)}/);

        if (mm) {
          let width: number = 0;
          let center: boolean = false;
          let url: string = "staticfiles/images/" + mm[2];

          if (mm[1]) {
            let mmm = mm[1].match(/width=(.*?)\\(?:line|text)width/);
            if (mmm) {
              width = parseFloat(mmm[1]);
              if (Number.isNaN(width)) {
                width = 0;
              }
              width = Math.round(100 * width);
            }
          }

          if (p.match(/\\centering/)) {
            center = true;
          }

          return `<p class="figure ${center ? 'center' : ''}">${this.getImageHtml(url, width)}</p>`;

        } else {
          return "";
        }
      });
  }

  private preprocessIncludegraphics() {
    this.preparedContent = this
      .preparedContent
      .replace(/\\includegraphics(?:\[(.*?)\])?{(.*?)}/g, (m, p1, p2) => {

        let width: number = 0;
        let url: string = "staticfiles/images/" + p2;

        if (p1) {
          let m = p1.match(/width=(.*?)\\(?:line|text)width/);
          if (m) {
            width = parseFloat(m[1]);
            if (Number.isNaN(width)) {
              width = 0;
            }
            width = Math.round(100 * width);
          }
        }

        return `<p class="figure">${this.getImageHtml(url, width)}</p>`;

      });
  }

  private getImageHtml(url: string, width: number): string {
    if (url.endsWith(".pdf")) {
      return `<a href="${url}" target="_blank" title="Klikněte pro zobrazení náhledu"><img class="acrobat" src="/api/upload/PdfRasterize/${url.replace("staticfiles/images/", "")}" ${width != 0 ? ' width="' + width + '%"' : ''}/></a>`;
    } else {
      return `<img src="${url}" ${width != 0 ? ' width="' + width + '%"' : ''}/>`;
    }
  }

  private preprocessLaTeXTextStyle(): boolean  {

    const rExp = /(?:{(?:\s*\\(it|bf|footnotesize))+\s*)|(?:\\(textit|textbf|underline)){/;

    let m = this.preparedContent.match(rExp);

    if (m && m.index != -1) {
      let end = this.findClosingBracket(this.preparedContent, m.index + m[0].length - 1);

      if (end != -1) {
        let tmp = this.preparedContent.substr(m.index, end - m.index/* + 1*/);
        tmp = tmp.replace(rExp, '')

        let className = m[1] ? m[1] : m[2].replace('text', '');

        this.preparedContent = this.preparedContent.substr(0, m.index) + "<span class=\"latex_" + className + "\">" + tmp + "</span>" + this.preparedContent.substr(end + 1);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  private findClosingBracket(str: string, pos: number): number {
    const rExp = /\{|\}/g;
    rExp.lastIndex = pos + 1;
    let deep = 1;
    let res: any;
    while ((res = rExp.exec(str))) {
      if (!(deep += str[res.index] === "{" ? 1 : -1)) { return res.index }
    }
    return -1;
  }

  renderMath() {
    setTimeout(() => {
      if (globals.isTypesetting) {
        globals.typesetNeeded = true;
      } else {
        globals.isTypesetting = true;
        window['MathJax']['Hub'].Queue(["Typeset", window['MathJax'].Hub/*, this.el.nativeElement.children[0]*/], () => this.typesetFinished());
      }      
    }, 0);
  }

  typesetFinished() {
    globals.isTypesetting = false;
    if (globals.typesetNeeded) {
      globals.typesetNeeded = false;
      this.renderMath();
    }
  }

  loadMathConfig() {
    if (globals.isMathJaxConfigured) {
      return;
    }
    globals.isMathJaxConfigured = true;

    window['MathJax'].Hub.Config({
      showMathMenu: true,
      messageStyle: "none",
      jax: ["input/TeX", "output/CommonHTML"],
      tex2jax: {
        inlineMath: [["$", "$"], ["\\(", "\\)"]],
        displayMath: [["$$", "$$"], ["\\[", "\\]"]],
        processEnvironments: true,
        preview: "none"//"TeX"
      },
      menuSettings: { zoom: "Double-Click", zscale: "150%" },
      CommonHTML: { linebreaks: { automatic: true } },
      "HTML-CSS": { linebreaks: { automatic: true } },
      SVG: { linebreaks: { automatic: true } },
      TeX: {
        Macros: {
          e: "{\\rm e}",
          arctg: "{\\rm arctg}",
          arccotg: "{\\rm arccotg}",
          tg: "{\\rm tg}",
          d: "{\\rm d}",
          intaabb: "\\int\\limits_\\alpha^\\beta",
          intab: "\\int\\limits_a^b",
          R: "{\\mathbb{R}}",
          f: "\\frac",
          lt: "\\left",
          rt: "\\right",
          ba: "\\begin{array}",
          ea: "\\end{array}",
          cotg: "{\\rm cotg}",
          p: "\\varphi",
        }
      }
    });
    window['MathJax'].Hub.Configured();
  }
}
