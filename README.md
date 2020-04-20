Steps to build opencv.js from source

Install Emscripten

git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
git pull
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh

Clone Opencv source

git clone https://github.com/opencv/opencv.git

Build Opencv.js

cd {opencv_dir}
python ./platforms/js/build_js.py build_js
With WASM (Recommend to use with nodejs)
python ./platforms/js/build_js.py build_wasm --build_wasm
Build doc
python ./platforms/js/build_js.py build_js --build_doc
Build test
python ./platforms/js/build_js.py build_js --build_test
If can't find emsdk directory with ENV EMSCRIPTEN
python ./platforms/js/build_js.py build_js --emscripten_dir={emsdk_dir}

Import opencv.js in Angular



Copy opencv.js file from build dir to assets/ in Angular project


Open file angular.json, find "scripts" and add link to opencv.js. It will look like this:


"scripts": [
  "src/assets/opencv.js"
]

Using opencv.js in component

Before init @Component add this: declare const cv: any;
Wait for opencv to load before calling anything:
cv['onRuntimeInitialized'] = () => {
{your code here}
}
Called function like tutorials in opencv.js tutorials
https://docs.opencv.org/3.4/d5/d10/tutorial_js_root.html
