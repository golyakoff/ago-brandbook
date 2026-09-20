# The public brand-identity reference at brandbook.reserve-me.ru - a single, self-contained static
# HTML page (no build step: no bundler, no framework, everything inline or a plain data script).
#
# `25-180`: CI publishes this to GHCR as ghcr.io/golyakoff/ago-brandbook, tagged with the full
# 40-character commit SHA - the same shape adr/0051 already gave ago-landing, ago-console and the two
# widget demo bundles.
#
# This is as easy to make honest as ago-landing is, and for the identical reason its own Dockerfile
# states: there is no environment input here at all - no API origin, no issuer, no build. The commit
# fully determines the image already, which is adr/0051's rule holding trivially rather than by effort.
#
# nginx's own "-alpine-slim" variant - the closest analogue to ago-chat's Chiseled-image preference
# that actually exists for nginx: official image, not a bespoke build, with the dynamic modules this
# static-file-only container never uses stripped out.
FROM nginx:1.31-alpine-slim
# `17-04`: the base tag names the image nginx's own maintainers published, not the Alpine packages
# inside it *today* - Alpine ships security fixes into its package repositories continuously,
# independent of when a base image was last rebuilt from them. `apk upgrade` reaches into the live
# package repository at build time and pulls whatever is patched *now*, so this image stays current
# between nginx's own rebuilds instead of only at the moment this Dockerfile happens to be edited -
# ago-landing's, ago-widget's and ago-console's own companion fixes found this the hard way, against
# the same base image family this repository shares.
# `--no-cache` skips the local index without leaving `/var/cache/apk` behind.
RUN apk update && apk upgrade --no-cache
# The commit this image is built from (`15-07`'s pattern). Defaults to "unknown" rather than failing
# the build: a local `docker build` for a quick check is a legitimate thing to do, and it should say
# "unknown" out loud rather than lie or refuse.
ARG GIT_COMMIT=unknown
# The OCI annotations a registry and `docker inspect`/`crane config` read. `.source` is not only
# documentation - GHCR uses it to link the published package back to this repository, which is what
# makes the package inherit the repository's own visibility instead of arriving orphaned.
LABEL org.opencontainers.image.source="https://github.com/golyakoff/ago-brandbook" \
      org.opencontainers.image.description="AGO Platform brand identity reference page" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.revision="${GIT_COMMIT}"
# `15-08`'s own fix, carried in from the start rather than found the hard way a second time: without
# this, nginx's own stock config sends no Cache-Control at all - see nginx.conf's own header comment.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY tokens.js /usr/share/nginx/html/tokens.js
# The five real channel icons (25-172), named one by one rather than `COPY icons/` - explicit is what
# keeps this list honest as the exact set of files this page ships, matching ago-landing's own
# "never `COPY .`" rule for the identical reason.
COPY icons/telegram.svg /usr/share/nginx/html/icons/telegram.svg
COPY icons/whatsapp.svg /usr/share/nginx/html/icons/whatsapp.svg
COPY icons/vk.svg /usr/share/nginx/html/icons/vk.svg
COPY icons/max.svg /usr/share/nginx/html/icons/max.svg
COPY icons/avito.svg /usr/share/nginx/html/icons/avito.svg
# `15-07`'s own pattern: the commit as a file the running container serves, so smoke.sh and deploy.sh
# have one question to ask and one answer to parse - `curl https://brandbook.reserve-me.ru/version.json`.
# Deliberately no build timestamp: two builds of one commit should be the same artifact, and a clock
# is the easiest way to make them differ for no reason.
RUN printf '{"app":"ago-brandbook","commit":"%s"}\n' "${GIT_COMMIT}" \
      > /usr/share/nginx/html/version.json
EXPOSE 80
