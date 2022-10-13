<template>
    <div>
        <div className="vui-relation-tree">
            <!-- 一个完整的 value 其实就是一个 RelationGroup -->
            <RelationGroup></RelationGroup>
        </div>
    </div>
</template>
<script>
    import RelationGroup from './subComponents/relationGroup.vue'
    import RelationItem from './subComponents/relationItem.vue'

    export default {
        name: 'RelationTree',
        components: {
            RelationGroup,
            RelationItem
        },
        data() {
            return {
                defaultRelation: {
                    ops: '',
                    children: [{}]
                }
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