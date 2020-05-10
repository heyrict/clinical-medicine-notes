MAINFILE = main.md
ALLFILES = $(shell ls *.md)
PDFCMD = pandoc --filter pandoc-tablenos -s --filter pandoc-imagine --latex-engine=xelatex -M CJKmainfont:文泉驿微米黑 --toc
HTMLCMD = pandoc  -c ../Templates/solarized-light.min.css --filter pandoc-imagine --mathjax --toc
HTMLDARKCMD = pandoc  -c ../Templates/solarized-dark.min.css --filter pandoc-imagine --mathjax --toc

html: $(MAINFILE)
	$(HTMLCMD) $(MAINFILE) -o $(MAINFILE).html;

pdf: $(MAINFILE)
	$(PDFCMD) $(MAINFILE) -o $(MAINFILE).pdf;

htmldark: $(MAINFILE)
	$(HTMLDARKCMD) $(MAINFILE) -o $(MAINFILE).html;

htmlall:
	for f in $(ALLFILES); do $(HTMLCMD) "$$f" -o "$$f.html"; done

htmldarkall:
	for f in $(ALLFILES); do $(HTMLDARKCMD) "$$f" -o "$$f.html"; done

pdfall:
	for f in $(ALLFILES); do $(PDFCMD) "$$f" -o "$$f.pdf"; done

clean:
	-rm -rf *.md.pdf *.md.html pd-images/;
