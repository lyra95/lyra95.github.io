default: serve

# powershell is the default shell unless there is shebang
set windows-shell := ["powershell.exe","-NoLogo", "-noprofile", "-c"]

fmt:
  nixpkgs-fmt .
  dprint fmt

lint:
  nixpkgs-fmt --check .
  dprint check
  typos

build:
  zola build -o $out/public --force

[macos]
serve:
  zola serve -p 8080 -o public --drafts --open

[linux]
serve:
  zola serve -p 8080 -o public --drafts

[windows]
serve:
  zola serve -p 8080 -o public --drafts --open
