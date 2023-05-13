.PHONY: fmt
fmt:
	dprint fmt

.PHONY: lint
lint:
	dprint check && typos
