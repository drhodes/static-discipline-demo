build:
	echo ok
test:
	echo ok

add: clean
	git add -A :/

commit:
	git commit -a

work:
	emacs -nw Makefile static-discipline.js static-discipline.html

clean:
	-@trash *~ 2>/dev/null || true

FORCE:
