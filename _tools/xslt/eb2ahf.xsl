<?xml version="1.0" encoding="UTF-8"?>
<!-- Copyright 2021 Antenna House, Inc. -->
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="3.0"
    xmlns:axf="http://www.antennahouse.com/names/XSL/Extensions"
    xmlns:ahf="http://www.antennahouse.com/names/XSLT/Functions/Document"
    xmlns:m="http://www.w3.org/1998/Math/MathML"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns="http://www.w3.org/1999/xhtml"
    xpath-default-namespace="http://www.w3.org/1999/xhtml"
    exclude-result-prefixes="ahf axf m svg xhtml xs xlink">

<xsl:output indent="no" omit-xml-declaration="no" method="xhtml"
            html-version="5" encoding="utf-8" />

<xsl:preserve-space elements="xhtml:pre m:math svg:svg"/>


<!-- ============================================================= -->
<!-- KEYS                                                          -->
<!-- ============================================================= -->

<xsl:key
    name="index-hits"
    match="comment()[matches(., '^\s*index:')]
                    [not(contains(., '&#xA;'))]"
    use="normalize-space(substring-after(., 'index:'))" />

<xsl:key
    name="index-hits"
    match="comment()[matches(., '^\s*index:')]
                    [contains(., '&#xA;')]"
    use="for $hit in tokenize(., '\n')[position() > 1]
                                      [normalize-space(.) ne '']
           return normalize-space($hit)" />


<!-- ============================================================= -->
<!-- STYLESHEET PARAMETERS                                         -->
<!-- ============================================================= -->

<xsl:param name="file-list" select="'file-list'" as="xs:string"
           static="yes" />


<!-- ============================================================= -->
<!-- STYLESHEET VARIABLES                                          -->
<!-- ============================================================= -->

<xsl:variable
    name="file-list-lines"
    select="if (unparsed-text-available($file-list))
              then unparsed-text-lines($file-list)[not(normalize-space(.) = '')]
            else ()"
    as="xs:string*"
    static="yes" />

<xsl:variable name="docs" as="document-node()*">
  <xsl:for-each select="$file-list-lines">
    <!--<xsl:message select="resolve-uri(., $file-list)" />-->
    <xsl:choose>
      <xsl:when test="doc-available(resolve-uri(., $file-list))">
        <xsl:sequence select="doc(resolve-uri(., $file-list))" />
      </xsl:when>
      <xsl:otherwise>
        <xsl:message expand-text="yes">Cannot open {.}</xsl:message>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:for-each>
</xsl:variable>


<!-- ============================================================= -->
<!-- INITIAL TEMPLATE                                              -->
<!-- ============================================================= -->

<xsl:template name="xsl:initial-template">
  <!--<xsl:message select="$file-list" />-->
  <!--<xsl:if test="exists($file-list-lines)">
    <xsl:message select="$file-list-lines" />
  </xsl:if>-->
  <xsl:apply-templates select="$docs[1]" />
</xsl:template>


<!-- ============================================================= -->
<!-- TEMPLATES                                                     -->
<!-- ============================================================= -->

<xsl:template match="document-node()[1]">
  <xsl:text>&#xA;</xsl:text>
  <xsl:apply-templates/>
</xsl:template>

<xsl:template match="body">
  <xsl:copy>
    <xsl:apply-templates select="$docs/html/body" mode="body-div" />
  </xsl:copy>
</xsl:template>

<xsl:template match="body" mode="body-div">
  <div id="{ahf:basename(base-uri(.), '.html')}">
    <xsl:apply-templates select="@*" />
    <xsl:apply-templates select="node()" mode="#default" />
  </div>
</xsl:template>

<xsl:template match="body/@class">
  <xsl:attribute name="{local-name()}"
                 select="string-join((., '__body'), ' ')" />
</xsl:template>

<!-- In a browser, creating @title is done by JavaScript. -->
<xsl:template match="(h1 | h2 | h3 | h4 | h5 | h6)[empty(@title)]">
  <xsl:param name="atts" select="()" as="attribute()*" />

  <xsl:next-match>
    <xsl:with-param name="atts" as="attribute()*">
      <xsl:attribute name="title" select="string(.)" />
      <!-- Put overriding attributes last in sequence. -->
      <xsl:sequence select="$atts" />
    </xsl:with-param>
  </xsl:next-match>
</xsl:template>

<!-- CSS won't match on the text content of an element, so have to
     provide the first letter as a hint. -->
<xsl:template match="p[preceding-sibling::*[1][self::h1]]">
  <xsl:param name="atts" select="()" as="attribute()*" />

  <xsl:next-match>
    <xsl:with-param name="atts" as="attribute()*">
      <xsl:attribute
          name="data-initial-letter"
          select="substring(., 1, 1)" />
      <!-- Put overriding attributes last in sequence. -->
      <xsl:sequence select="$atts" />
    </xsl:with-param>
  </xsl:next-match>
</xsl:template>

<!-- Prefix each ID with its document's filename. -->
<xsl:template match="@id">
  <xsl:attribute
      name="{local-name()}"
      expand-text="yes"
      >{ahf:basename(base-uri(.), '.html')}__{.}</xsl:attribute>
</xsl:template>

<!-- Do not add a prefix to 'http' links. -->
<xsl:template match="@href[starts-with(., 'http')]"
              priority="5">
  <xsl:copy-of select="." />
</xsl:template>

<!-- Prefix fragments with current document's filename.  Works for
     both 'href' and 'xlink:href' in SVG. -->
<xsl:template match="@*:href[starts-with(., '#')]">
  <xsl:attribute
      name="{name()}"
      expand-text="yes"
      >#{ahf:doc-and-href(.)}</xsl:attribute>
</xsl:template>

<!-- Cross-reference to a document becomes a reference to its
     <div>. -->
<xsl:template match="@href[ends-with(., '.html')]">
  <xsl:attribute
      name="{local-name()}"
      expand-text="yes"
      >#{substring-before(., '.html')}</xsl:attribute>
</xsl:template>

<!-- Reference to ID in another document becomes reference to filename
     prefix plus the ID. -->
<xsl:template match="@href[contains(., '.html#')]">
  <xsl:attribute
      name="{local-name()}"
      expand-text="yes"
      >#{replace(., '\.html#', '__')}</xsl:attribute>
</xsl:template>

<!-- Drop <script>. -->
<xsl:template match="script" />

<!-- Copy everything that doesn't have any other match. -->
<xsl:mode on-no-match="shallow-copy" />

<!-- Identity (almost) template for elements.
     Copy everything, but possibly add overriding attributes from
     $atts parameter. -->
<xsl:template match="*">
  <xsl:param name="atts" select="()" as="attribute()*" />

  <xsl:copy>
    <xsl:apply-templates select="@*" />
    <xsl:copy-of select="$atts" />
    <xsl:apply-templates select="node()" />
  </xsl:copy>
</xsl:template>


<!-- ============================================================= -->
<!-- SVG                                                           -->
<!-- ============================================================= -->

<!-- XML is case-sensitive, unlike HTML. -->
<xsl:template match="svg:*/@viewbox">
  <xsl:attribute name="viewBox" select="." />
</xsl:template>


<!-- ============================================================= -->
<!-- INDEX PROCESSING                                              -->
<!-- ============================================================= -->

<!-- Generate an <a> for comments containing an index hit within
     text. -->
<xsl:template
    match="comment()[matches(., '^\s*index:')]
                    [following-sibling::node()[1][self::text()]
                                                 [normalize-space(.) != '']]">
  <xsl:next-match />
  <a id="{ahf:doc-and-id(.)}" />
</xsl:template>

<!-- Generate an ID on an element after an index hit if the element
     doesn't already have an ID. -->
<xsl:template match="*[preceding-sibling::node()[position() = (1, 2)]
                                                [self::comment()]
                                                [matches(., '^\s*index:')]]
                      [empty(@id)]">
  <xsl:copy>
    <xsl:attribute
        name="id"
        select="ahf:doc-and-id(.)" />
    <xsl:apply-templates select="@*" />
    <xsl:apply-templates select="node()" />
  </xsl:copy>
</xsl:template>

<!-- Index terms or sub-terms in the dynamic index. -->
<xsl:template match="ul[@class = 'reference-index']//li">
  <xsl:param name="parent-terms" select="()" as="xs:string*"
             tunnel="yes" />

  <xsl:variable name="term"
                select="string-join(($parent-terms,
                                     normalize-space(text()[1])),
                                     ' \\ ')"
                as="xs:string" />
  
  <!--<xsl:message select="normalize-space(text()[1]), $term" />-->
  <xsl:copy>
    <xsl:apply-templates select="@*" />
    <xsl:apply-templates
        select="normalize-space(text()[1])" />
    <xsl:variable name="hits" as="element()*">
      <xsl:for-each select="$docs">
      <xsl:variable name="current-doc" select="." as="document-node()" />
    <xsl:for-each
        select="key('index-hits',
                    ($term, concat($term, '-')),
                    $current-doc)">
      <xsl:choose>
        <!-- If it's followed by text, it won't be a range (we assume.) -->
        <xsl:when
            test="following-sibling::node()[1][self::text()]
                                              [normalize-space(.) != '']">
          <a class="reference"
             href="#{ahf:doc-and-id(.)}" />
        </xsl:when>
        <xsl:otherwise>
          <xsl:variable name="current-hit" select="." as="comment()" />
          <xsl:choose>
            <!-- Is this the start of a page range? -->
            <xsl:when
                test="some $hit in key('index-hits',
                                       concat($term, '-'),
                                       $current-doc)
                        satisfies $hit = .">
              <!--<xsl:message select="'Page range:', $term" />-->
              <xsl:variable name="range-start" select="." as="comment()" />
              <xsl:variable
                  name="range-end"
                  select="key('index-hits',
                              concat('-', $term),
                              $current-doc)[. >> $range-start][1]"
                  as="comment()" />
              <span>
                <a class="reference"
                   href="#{ahf:doc-and-id($range-start/following-sibling::*[1])}" />
                <xsl:text>&#x2013;</xsl:text>
          <a class="reference"
             href="#{ahf:doc-and-id($range-end/following-sibling::*[1])}" />
              </span>
            </xsl:when>
            <!-- Do not generate a single hit in the middle of a range. -->
            <xsl:when
                test="count(key('index-hits',
                                concat($term, '-'),
                                $current-doc)[. &lt;&lt; $current-hit]) =
                      count(key('index-hits',
                                concat('-', $term),
                                $current-doc)[. &lt;&lt; $current-hit])">
              <a class="reference"
                 href="#{ahf:doc-and-id(following-sibling::*[1])}" />
            </xsl:when>
          </xsl:choose>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
      </xsl:for-each>
    </xsl:variable>
    <xsl:if test="exists($hits)">
      <span class="references">
        <xsl:for-each select="$hits">
          <xsl:if test="position() > 1">, </xsl:if>
          <xsl:choose>
            <xsl:when test="node()">
              <xsl:sequence select="node()" />
            </xsl:when>
            <xsl:otherwise>
              <xsl:sequence select="." />
            </xsl:otherwise>
          </xsl:choose>
        </xsl:for-each>
      </span>
    </xsl:if>
    <xsl:apply-templates
        select="node() except text()[1]">
      <xsl:with-param
          name="parent-terms"
          select="$parent-terms, normalize-space(text()[1])"
          as="xs:string*"
          tunnel="yes" />
    </xsl:apply-templates>
  </xsl:copy>
</xsl:template>


<!-- ============================================================= -->
<!-- FUNCTIONS                                                     -->
<!-- ============================================================= -->

<!-- Gets the last component of $uri. -->
<xsl:function name="ahf:basename" as="xs:string"
              cache="yes">
  <xsl:param name="uri" as="xs:string" />

  <xsl:sequence select="tokenize($uri, '/|\\')[last()]" />
</xsl:function>

<!-- Gets the last component of $uri. -->
<xsl:function name="ahf:basename" as="xs:string"
              cache="yes">
  <xsl:param name="uri" as="xs:string" />
  <xsl:param name="suffix" as="xs:string" />

  <xsl:variable name="suffix-regex"
		select="replace(concat(if (starts-with($suffix, '.')) then '' else '.', $suffix, '$'), '\.', '\\.')"
		as="xs:string" />

  <xsl:sequence select="replace(tokenize($uri, '/')[last()], $suffix-regex, '')" />
</xsl:function>

<!-- Gets the directory component of $uri. -->
<xsl:function name="ahf:dirname" as="xs:string"
              cache="yes">
  <xsl:param name="uri" as="xs:string" />

  <xsl:sequence
      select="string-join(tokenize($uri, '/|\\')[position() != last()],
                          '/')" />
</xsl:function>

<xsl:function name="ahf:doc-and-id" as="xs:string">
  <xsl:param name="node" as="node()" />

  <xsl:sequence
      expand-text="yes"
      >{ahf:basename(base-uri($node), '.html')}__{($node/@id, generate-id($node))[1]}</xsl:sequence>
</xsl:function>

<xsl:function name="ahf:doc-and-href" as="xs:string">
  <xsl:param name="node" as="node()" />

  <xsl:sequence
      select="ahf:doc-and-href($node, string($node))" />
</xsl:function>

<xsl:function name="ahf:doc-and-href" as="xs:string">
  <xsl:param name="node" as="node()" />
  <xsl:param name="href" as="xs:string" />

  <xsl:sequence
      expand-text="yes"
      >{ahf:basename(base-uri($node), '.html')}__{substring-after($href, '#')}</xsl:sequence>
</xsl:function>

</xsl:stylesheet>
