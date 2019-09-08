import Vue from 'vue'
import Router from 'vue-router'
import drawHouse from '@/components/drawHouse'
import openlayer from '@/components/openlayer'
import robote from '@/components/robote'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'drawHouse',
        component: drawHouse
    }, {
        path: "/map",
        name: "openlayer",
        component: openlayer
    }, {
        path: "/robote",
        name: "robote",
        component: robote
    }]
})