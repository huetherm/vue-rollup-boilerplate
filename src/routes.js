import Vue from 'vue'
import Router from 'vue-router'
import Vuelidate from './components/Vuelidate'
import HelloWorld from './components/HelloWorld'
import Counter from './components/Counter'

const routes = [{
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld
    }, {
        path: '/vuelidate',
        name: 'Vuelidate',
        component: Vuelidate
    }, {
        path: '/counter',
        name: 'Counter',
        component: Counter
    }
]

Vue.use(Router)

export default new Router({
    routes
})
