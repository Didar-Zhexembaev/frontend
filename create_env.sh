#!/bin/bash

folder=frontend
clone_url=https://github.com/Didar-Zhexembaev/frontend.git
path="$folder/config/gulp/"
css_path="src/css"
js_path="src/js"

# cdns
	# css
		# bootstrap v4.6
		bootstrap_css="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
	# js
		bootstrap_js="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js"
		# jquery 3.6
		jquery="https://code.jquery.com/jquery-3.6.0.min.js"

parse_args() {
	while [ -n "$1" ]; do
			jquery)
				[ ! -e "$js_path/$(basename $jquery)" ] &&
					wget "$jquery" -P "$js_path"
			;;
			clean)
				echo $(basename "$0")
			;;
		esac
		shift
	done
}

# start steps

[ ! -d "$folder" ] && git clone "$clone_url"

[ -n "$(ls $path)" ] && mv $path* .

rm -rf $folder

if [ ! -d "node_modules" ]; then
	type npm && npm i || echo 'please install npm'
fi

[ ! -d "dist" -o ! -d "src" ] && gulp env

parse_args "$@"

# remove self
rm $0

# test comment
