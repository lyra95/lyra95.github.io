{
  description = "my blog flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.05";
    flake-utils.url = "github:numtide/flake-utils";
    devshell = {
      url = "github:numtide/devshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    pre-commit = {
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs-stable.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    devshell,
    pre-commit,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      packages.default = pkgs.stdenv.mkDerivation {
        name = "lyra95-blog";
        src = ./.;
        buildInputs = with pkgs; [zola];
        buildPhase = ''
          rm -rf $out/public
          zola build -o $out/public
        '';
      };

      checks = {
        pre-commit = pre-commit.lib.${system}.run {
          src = ./.;
          hooks = {
            alejandra.enable = true;
            typos.enable = true;
            prettier.enable = true;
            dprint = {
              enable = true;
              package = pkgs.dprint;
              name = "dprint";
              entry = "dprint check";
              pass_filenames = false;
            };
          };
        };
      };

      devShells.default = let
        mkShell =
          (import devshell {
            inherit system;
            nixpkgs = pkgs;
          })
          .mkShell;
      in
        mkShell {
          env = [
            {
              name = "FLAKE_ROOT";
              eval = "$PWD";
            }
            {
              name = "DPRINT_CACHE_DIR";
              eval = "$PWD/.cache/dprint";
            }
          ];

          devshell.startup."pre-commit".text = self.checks.${system}.pre-commit.shellHook;

          packages =
            (with pkgs; [zola])
            ++ self.checks.${system}.pre-commit.enabledPackages;
          commands = [
            {
              help = "run formatter";
              name = "fmt";
              command = ''
                set -x
                alejandra "$FLAKE_ROOT"
                dprint fmt
                prettier --write .
                set +x
              '';
            }
            {
              help = "live reload";
              name = "live";
              command = "zola serve";
              category = "blog";
            }
          ];
        };
    });
}
