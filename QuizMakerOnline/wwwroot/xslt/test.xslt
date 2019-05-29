<?xml version="1.0" encoding="windows-1250"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="text" encoding="windows-1250"/>

  <xsl:template match="/">
\documentclass[12pt]{article}
\usepackage{amsfonts} %% Kvuli dvojitemu R
\usepackage[czech]{babel}
\usepackage[cp1250]{inputenc}
\usepackage{graphicx}

\pagestyle{empty}
\parindent=0pt
\topmargin=-30mm
\oddsidemargin=-10mm

%Na�ten� p�eddefinovan�ch vztah�, kter� jsou v souboru preddefinovane.sty
\usepackage{../sty/preddefinovane}

%Uprava sirky a delky textu na strance
\textheight 27cm
\textwidth 16.5cm


\begin{document}
    <xsl:apply-templates/>
\end{document}
  </xsl:template>

  <xsl:template match="test">
�pice MemoryStream ne: <xsl:value-of select="@name"/> a p�kn� od za��tku

<xsl:apply-templates select="Questions"/>
  </xsl:template>

  <xsl:template match="Questions">
    \bigskip
    {\bf <xsl:value-of select="position()"/>.} <xsl:value-of select="@question"/>
    <!--<xsl:if test="@id_question_type!=2">
      <xsl:apply-templates select="Answers"/>
    </xsl:if>-->
    <xsl:text>
</xsl:text>
  </xsl:template>


</xsl:stylesheet>