/*https://github.com/shubhvjain/angular-mathjax*/

import { Component, OnInit, Input, OnChanges, AfterViewInit, ElementRef } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { globals } from '../../globals';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'mathjax',
  templateUrl: './mathjax.component.html',
  styleUrls: ['./mathjax.component.css']
})
export class MathjaxComponent implements OnChanges, OnInit {
  @Input() content: string;

  get preparedContent(): string {
    let terms = this.content.split(/(\$\$|\$|\\\[|\\\])/);
    let inmath = false;
    let res = "";

    for (let t of terms) {

      if (t == "$$" || t == "$" || t == "\\[" || t == "\\]") {
        inmath = !inmath;
      } else if (!inmath) {
        if (t.includes("\\begin")) {
          return this.content;
        }
        t = /*'<span class="textnomath">' + */t
          .replace(new RegExp(/\\\\|\\medskip|\n\n|\r\n\r\n/, 'g'), "<br/>")
          .replace(new RegExp(/\\q+uad|~/, 'g'), "&nbsp;")
          /*+ '</span>'*/;
      } else {
        t = t
          .replace(new RegExp(/</, 'g'), "< ");
      }
      res += t;
    }
    return res;    
  }

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content']) {
      this.renderMath()
    }
  }
  ngOnInit() {
    this.loadMathConfig()
    this.renderMath();
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
