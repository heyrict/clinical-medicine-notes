CURDIR := invocation_directory()
PDFCMD := "pandoc --filter pandoc-tablenos -s --filter pandoc-imagine --pdf-engine=xelatex --metadata-file=" + CURDIR + "/Templates/metadata.yaml --toc"
HTMLCMD := "pandoc --shift-heading-level-by=1 -c " + CURDIR + "/Templates/solarized-light.min.css --filter pandoc-imagine --mathjax --toc --self-contained"
HTMLDARKCMD := "pandoc -c " + CURDIR + "/Templates/solarized-dark.min.css --filter pandoc-imagine --mathjax --toc --self-contained"

html +FILES:
	@for f in {{FILES}}; do just _html $f; done;

pdf +FILES:
	@for f in {{FILES}}; do just _pdf $f; done;

htmldark +FILES:
	@for f in {{FILES}}; do just _htmldark $f; done;

_html FILE:
	#!/usr/bin/env bash
	BN="`basename {{FILE}} .md`"
	DN="`dirname {{FILE}}`"
	echo "Converting: {{FILE}} -> $DN/$BN.html"
	{{HTMLCMD}} --metadata pagetitle="$DN/$BN" "{{FILE}}" -o "$DN/$BN.html";

_pdf FILE:
	#!/usr/bin/env bash
	BN="`basename {{FILE}} .md`"
	DN="`dirname {{FILE}}`"
	echo "Converting: {{FILE}} -> $DN/$BN.pdf"
	{{PDFCMD}} --metadata pagetitle="$DN/$BN" "{{FILE}}" -o "$DN/$BN.pdf";

_htmldark FILE:
	#!/usr/bin/env bash
	BN="`basename {{FILE}} .md`"
	DN="`dirname {{FILE}}`"
	echo "Converting: {{FILE}} -> $DN/$BN.html"
	{{HTMLDARKCMD}} --metadata pagetitle="$DN/$BN" "{{FILE}}" -o "$DN/$BN.html";

clean:
	echo "Cleaning html, pdf and pd-images"
	@fd -I '(.html|.pdf)$' --exec rm;
	@fd -I '^pd-images$' --exec rm -rf {};
	@for f in `ls`; do \
		if [ -d "$f" ]; then \
			if [ -f "$f/justfile" ] && [ -n "$(just -f "$f/justfile" -d "$f" --summary | rg clean)" ]; then \
				echo ">>> Run just clean in $f";\
				just -f "$f/justfile" -d "$f" clean;\
			fi;\
			if [ -f "$f"/Makefile ]; then \
				echo ">>> Run make clean in $f";\
				cd "$f"; make clean; cd ..;\
			fi;\
		fi;\
	done;

commit:
	git commit -m "Update: `date -I`"
