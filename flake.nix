{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-23.05";
    flake-utils.url = "github:numtide/flake-utils/v1.0.0";
  };
  outputs = { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        linters = with pkgs; [ nixpkgs-fmt dprint typos ];
        buildEssential = with pkgs; [ just zola ];
      in
      {
        devShells = {
          # nix develop
          default = pkgs.mkShell {
            packages = buildEssential ++ linters;
          };
        };

        packages = {
          # nix build
          default = pkgs.stdenv.mkDerivation {
            name = "lyra95's blog";
            src = ./.;
            buildInputs = buildEssential;
            buildPhase = ''
              just build
            '';
          };
        };
      });
}
