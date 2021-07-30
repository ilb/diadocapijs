SRCXML=$(wildcard *.xml)
SRCPUML=$(wildcard *.puml)
all: xhtml dot svg

xhtml: $(patsubst %.xml,%.xhtml,$(SRCXML))
dot: $(patsubst %.xml,%.dot,$(SRCXML))
svg: $(patsubst %.puml,%.svg,$(SRCPUML))
png: $(patsubst %.puml,%.png,$(SRCPUML))

%.svg: %.dot
	dot -Tsvg $< -o $@

%.xhtml: %.xml
	xsltproc -o $@ $<

%.dot: %.xml
	xsltproc `grep xml-stylesheet $<|awk -F'"' '{print $$4}'|sed 's/xhtml/dot/'` $< >$@

%.svg: %.puml
	plantuml -tsvg $<

%.png: %.puml
	plantuml -tpng $<
