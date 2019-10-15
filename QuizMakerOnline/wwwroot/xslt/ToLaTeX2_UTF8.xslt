<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text" encoding="utf-8"/>

<xsl:template match="/">\documentclass[12pt]{article}
\usepackage{amsfonts} %% Kvuli dvojitemu R
\usepackage{amsmath}
\usepackage[czech]{babel}
\usepackage[utf8]{inputenc}
\usepackage{graphicx}

\pagestyle{empty}
\parindent=0pt
\topmargin=-30mm
\oddsidemargin=-10mm

%Načtení předdefinovaných vztahů, které jsou v souboru preddefinovane.sty
%\usepackage{../sty/preddefinovane}
\def\e{{\rm e}}
\def\arctg{{\rm arctg}}
\def\arccotg{{\rm arccotg}}
\def\tg{{\rm tg}}
\def\d{{\rm d}}
\def\intaabb{\int\limits_\alpha^\beta}
\def\intab{\int\limits_a^b}
\def\R{{\mathbb{R}}}
\def\f{\frac}
\def\[{$$}
\def\]{$$}
\def\lt{\left}
\def\rt{\right}
\def\ba{\begin{array}}
\def\ea{\end{array}}
\def\cotg{{\rm cotg}}
\def\p{\varphi}

%Uprava sirky a delky textu na strance
\textheight 27cm
\textwidth 16.5cm


\begin{document}
<xsl:apply-templates/>
\end{document}
</xsl:template>

<xsl:template match="Tests">
{\bf <xsl:value-of select="@header"/>} <!--\quad <xsl:value-of select="@group"/>-->
\bigskip
\begin{enumerate}
<xsl:apply-templates select="Questions"/>
\end{enumerate}
</xsl:template>

<xsl:template match="Questions">
\item
<xsl:value-of select="@question"/><xsl:if test="@question!='' and @id_question_type!=2">~\\
</xsl:if>
<xsl:if test="@id_question_type!=2">
<xsl:apply-templates select="Answers"/>
</xsl:if>
<xsl:if test="@points!=0 and @id_question_type!=3 and /Tests/@showPoints='true'">
\hfill(<xsl:value-of select="@points"/><xsl:text> </xsl:text> <xsl:choose>
<xsl:when test="@points=1">bod</xsl:when>
<xsl:when test="@points &lt; 5">body</xsl:when>
<xsl:otherwise>bodů</xsl:otherwise>
</xsl:choose>)
</xsl:if>
<xsl:if test="/Tests/@showSolution='true'">
{\bf Řešení:}
<xsl:value-of select="@solution"/><xsl:text>


</xsl:text>
</xsl:if>
</xsl:template>

<xsl:template match="Answers">
<xsl:value-of select="@position"/>) <xsl:value-of select="@answer"/><xsl:if test="parent::node()/@id_question_type=3 and /Tests/@showPoints='true' and @points!=0">
\hfill(<xsl:value-of select="@points"/><xsl:text> </xsl:text> <xsl:choose>
<xsl:when test="@points=1">bod</xsl:when>
<xsl:when test="@points &lt; 5">body</xsl:when>
<xsl:otherwise>bodů</xsl:otherwise>
</xsl:choose>)
</xsl:if><xsl:if test="position()!=last()">~\\
</xsl:if>
</xsl:template>
</xsl:stylesheet>