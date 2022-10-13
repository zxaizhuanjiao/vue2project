<template>
    <span>
        <img src="../assets/color.png" style="width: 30px; top: 13px; right: 210px; position: absolute">
        <span style="right: 170px; position: absolute; cursor: pointer;color: #040848" @click="showColor">主题</span>
        <el-color-picker
                style="position: absolute;right: 300px;top: -32px;"
                ref="colorPicker"
                class="theme-picker"
                popper-class="theme-picker-dropdown"
                v-model="theme"
                @change="colorChange()"
                color-format="hex"
                :size="size">
        </el-color-picker>
    </span>
</template>

<script>
    // element-ui version from node_modules
    const version = require('element-ui/package.json').version;
    // default color
    const ORIGINAL_THEME = '#F26521';
    export default {
        name: 'ThemePicker',
        props: {
            default: {
                // 初始化主题，可由外部传入
                type: String,
                //default: '#EB815B'
                default: '' + sessionStorage.getItem('themeValue')
            },
            size: {
                // 初始化主题，可由外部传入
                type: String,
                default: 'small'
            }
        },
        data() {
            return {
                // content of theme-chalk css
                chalk: '',
                theme: ORIGINAL_THEME,
                // 是否弹出换肤成功消息
                showSuccess: true,
            }
        },
        mounted() {
            if(this.default != null) {
                this.theme = this.default;
                this.$emit('onThemeChange', this.theme);
                this.showSuccess = false
            }
        },
        watch: {
            theme(val, oldVal) {
                if (val === 'null') {
                    val = this.$store.state.themeData.themeValue;
                }
                if (val !== 'null' && oldVal !== 'null') {
                    if (typeof val !== 'string') return;
                    const themeCluster = this.getThemeCluster(val.replace('#', ''));
                    const originalCluster = this.getThemeCluster(oldVal.replace('#', ''));
                    const getHandler = (variable, id) => {
                        return () => {
                            const originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace('#', ''));
                            const newStyle = this.updateStyle(this[variable], originalCluster, themeCluster);

                            let styleTag = document.getElementById(id);
                            if (!styleTag) {
                                styleTag = document.createElement('style');
                                styleTag.setAttribute('id', id);
                                document.head.appendChild(styleTag);
                            }
                            styleTag.innerText = newStyle
                        }
                    };

                    const chalkHandler = getHandler('chalk', 'chalk-style');

                    if (!this.chalk) {
                        const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;
                        this.getCSSString(url, chalkHandler, 'chalk');
                    } else {
                        chalkHandler();
                    }

                    const styles = [].slice.call(document.querySelectorAll('style'))
                        .filter(style => {
                            const text = style.innerText;
                            return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text);
                        });
                    styles.forEach(style => {
                        const { innerText } = style;
                        if (typeof innerText !== 'string') return;
                        style.innerText = this.updateStyle(innerText, originalCluster, themeCluster)
                    });

                    // 响应外部操作
                    this.$emit('onThemeChange', val);
                    //存入sessionStorage
                    if (val && val !=='null') {
                        sessionStorage.setItem('themeValue',val);
                        document.getElementsByClassName('el-color-dropdown')[0].style.display = 'none';
                        this.$store.commit('themeData/setThemeValue', val);
                    }
                }
            }
        },
        methods: {
            showColor() {
                document.getElementsByClassName('el-color-svpanel__cursor')[0].style.top = this.$store.state.themeData.top;
                document.getElementsByClassName('el-color-svpanel__cursor')[0].style.left = this.$store.state.themeData.left;
                document.getElementsByClassName('el-color-dropdown')[0].style.display = 'block';
            },

            colorChange() {
                this.$store.commit('themeData/setTop', document.getElementsByClassName('el-color-svpanel__cursor')[0].style.top);
                this.$store.commit('themeData/setLeft', document.getElementsByClassName('el-color-svpanel__cursor')[0].style.left);
                document.getElementsByClassName('el-color-dropdown')[0].style.display = 'none';
            },

            updateStyle(style, oldCluster, newCluster) {
                let newStyle = style;
                oldCluster.forEach((color, index) => {
                    newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
                });
                return newStyle;
            },

            getCSSString(url, callback, variable) {
                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '');
                        callback();
                    }
                };
                xhr.open('GET', url);
                xhr.send();
            },

            getThemeCluster(theme) {
                const tintColor = (color, tint) => {
                    let red = parseInt(color.slice(0, 2), 16);
                    let green = parseInt(color.slice(2, 4), 16);
                    let blue = parseInt(color.slice(4, 6), 16);

                    if (tint === 0) {
                        // when primary color is in its rgb space
                        return [red, green, blue].join(',');
                    } else {
                        red += Math.round(tint * (255 - red));
                        green += Math.round(tint * (255 - green));
                        blue += Math.round(tint * (255 - blue));

                        red = red.toString(16);
                        green = green.toString(16);
                        blue = blue.toString(16);

                        return `#${red}${green}${blue}`;
                    }
                };

                const shadeColor = (color, shade) => {
                    let red = parseInt(color.slice(0, 2), 16);
                    let green = parseInt(color.slice(2, 4), 16);
                    let blue = parseInt(color.slice(4, 6), 16);

                    red = Math.round((1 - shade) * red);
                    green = Math.round((1 - shade) * green);
                    blue = Math.round((1 - shade) * blue);

                    red = red.toString(16);
                    green = green.toString(16);
                    blue = blue.toString(16);

                    return `#${red}${green}${blue}`;
                };

                const clusters = [theme];
                for (let i = 0; i <= 9; i++) {
                    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
                }
                clusters.push(shadeColor(theme, 0.1));
                return clusters
            }
        }
    }
</script>

<style>
    .theme-picker .el-color-picker__trigger {
        vertical-align: middle;
    }
    .theme-picker-dropdown .el-color-dropdown__link-btn {
        display: none;
    }
    .el-color-picker--small .el-color-picker__trigger {
        border: none;
    }
    .el-color-picker__color {
        border: none!important;
    }
    .el-color-picker__color.is-alpha {
        border: none;
    }
    .el-color-picker__color-inner {
        border: none;
        background-image: url('../assets/color.png');
    }
    .el-color-picker__color.is-alpha {
        background-image: none!important;
    }
    .el-color-picker__color::before {
        display: block;
        height: 80%;
        content: '';
        background-image: url('../assets/color.png');
        background-size: 100% 100%;
    }
    .el-color-picker__icon {
        display: none!important;
    }
</style>
