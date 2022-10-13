<template>
    <div>
        <div class="vui-relation-group">
            <div class="relational">
                <el-select v-model="relationValue" placeholder="请选择">
                    <el-option
                        v-for="item in relationOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <!-- <div class="conditions">
                <RelationGroup
              pos={newPos}
              key={newPos}
              data={record}
              setElementTerm={setElementTerm}
            />
            </div> -->
        </div>
    </div>
</template>
<script>
    export default {
        name: 'RelationGroup',
        components: {

        },
        props: {

        },
        data() {
            return {
                relationOptions: [
                    {
                        value: 'and',
                        label: '且'
                    },
                    {
                        value: 'or',
                        label: '或'
                    }
                ],
                relationValue: ''
            }
        },
        watch: {

        },
        created() {

        },
        mounted() {

        },
        methods: {

        }
    }
</script>
<style>
    
</style>