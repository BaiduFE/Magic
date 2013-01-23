/*
 * Copyright (c) 2012, Baidu Inc. All rights reserved.
 * Licensed under the BSD License
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://tangram.baidu.com/license.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 声明 MagicCube 包
 * @author dron
 * 
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

if(typeof magic != "function"){
    var magic = function(){
        // TODO: 
    };
}

magic.resourcePath = "";
magic.skinName = "default";
magic.version = "1.1.0.0";

/msie 6/i.test(navigator.userAgent) && 
document.execCommand("BackgroundImageCache", false, true);
