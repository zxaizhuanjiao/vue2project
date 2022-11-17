<template>
    <div>
        <!-- <CreateRule :formDatas="formDatas" :rulesData="rulesData" @rulesChange="rulesChange" /> -->
        1111
    </div>
</template>
<script>
    import CreateRule from '../../components/createRule/createRule.vue'

    export default {
        name: 'Dashboard',
        components: {
            CreateRule
        },
        data() {
            return {
                formDatas:[
                    {
                        label:"条件名1",
                        value:"one"
                    },
                    {
                        label:"条件名2",
                        value:"two"
                    }
                ],
                rulesData:{//初始化条件对象或者，已保存的条件对象
                    relation:"and",
                    conditions:[],
                    children:[]
                }
            }
        },
        created() {

        },
        mounted() {

        },
        methods: {
            rulesChange(datas){
                console.log(datas)//输出的条件对象
            }
        }
    }
</script>
