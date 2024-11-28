{
  pkgs,
  symlinkJoin,
  makeWrapper,
  mkDerivation ? pkgs.stdenv.mkDerivation,
  dprint ? pkgs.dprint,
}: let
  plugins = mkDerivation {
    pname = "dprint-plugins";
    version = "0.0.0";
    src = ./dprint.json;
    doCheck = false;
    dontUnpack = true;
    dontFixup = true;
    nativeBuildInputs = [dprint pkgs.cacert pkgs.jq];
    buildPhase = ''
      export DPRINT_CACHE_DIR=$PWD/.cache
      mkdir -p $DPRINT_CACHE_DIR
      dprint check --config $src --allow-no-files true
    '';
    installPhase = ''
      mkdir -p $out/.cache
      cp .cache/plugin-cache-manifest.json $out/.cache
      cp -r .cache/plugins $out/.cache
      jq -S '
        .plugins |=
        with_entries(
          .value.createdTime = 0
        )
      ' $out/.cache/plugin-cache-manifest.json > tmp
      mv tmp $out/.cache/plugin-cache-manifest.json
    '';
    outputHashAlgo = "sha256";
    outputHashMode = "recursive";
    outputHash = "sha256-mKUblwKD77XmRvipfz+dFnfpGuCk7PpezSwDRF/ASZg=";
  };
in
  symlinkJoin {
    name = "dprint";
    buildInputs = [makeWrapper];
    paths = [dprint];
    postBuild = ''
      wrapProgram $out/bin/dprint \
        --set DPRINT_CACHE_DIR ${plugins}/.cache
    '';
  }
