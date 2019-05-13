/*https://github.com/shubhvjain/angular-mathjax*/

import { Component, OnInit, Input, OnChanges, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { globals } from '../../globals';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'mathjax',
  templateUrl: './mathjax.component.html',
  styleUrls: ['./mathjax.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MathjaxComponent implements OnChanges, OnInit {
  @Input() content: string;
  preparedContent: string;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content']) {
      this.prepareContent();
      this.renderMath()
    }
  }
  ngOnInit() {
    this.loadMathConfig()
    this.renderMath();
  }

  prepareContent(): string {
    this.preparedContent = "";

    let terms = this.content.split(/(\$\$|\$|\\\[|\\\])/);
    let inmath = false;

    for (let t of terms) {

      if (t == "$$" || t == "$" || t == "\\[" || t == "\\]") {
        inmath = !inmath;
      } else if (!inmath) {
        if (t.includes("\\begin")) {
          this.preparedContent = this.content;
          return;
        }
        t = /*'<span class="textnomath">' + */t
          .replace(new RegExp(/\\\\|\\medskip|\n\n|\r\n\r\n/, 'g'), "<br/>")
          .replace(new RegExp(/\\q+uad|~/, 'g'), "&nbsp;")
          /*+ '</span>'*/;
      } else {
        t = t
          .replace(new RegExp(/</, 'g'), "< ");
      }
      this.preparedContent += t;
    }

    while (this.preprocessLaTeX()) {

    };

  }

  private preprocessLaTeX(): boolean  {

    const rExp = /{\s*\\(?<tag1>it|bf|footnotesize)\s*|\\text(?<tag2>it|bf){/;

    let m = this.preparedContent.match(rExp);

    if (m && m.index != -1) {
      let end = this.findClosingBracket(this.preparedContent, m.index);

      if (end != -1) {
        let tmp = this.preparedContent.substr(m.index, end - m.index/* + 1*/);
        tmp = tmp.replace(rExp, '')

        let className = m.groups["tag2"] ? m.groups["tag2"] : m.groups["tag1"];

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
      window['MathJax']['Hub'].Queue(["Typeset", window['MathJax'].Hub/*, this.el.nativeElement.children[0]*/]);
    }, 0);
  }

  loadMathConfig() {
    if (globals.isMathJaxConfigured) {
      return;
    }
    globals.isMathJaxConfigured = true;

    window['MathJax'].Hub.Config({
      showMathMenu: true,
      jax: ["input/TeX", "output/CommonHTML"],
      tex2jax: {
        inlineMath: [["$", "$"]],
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
