const state = {
    showColors: false
}

const getters = {
    blue:   state => { return state.showColors ? "bg-blue"    : '' },
    green:  state => { return state.showColors ? "bg-green"   : '' },
    indigo: state => { return state.showColors ? "bg-indigo"  : '' },
    orange: state => { return state.showColors ? "bg-orange"  : '' },
    pink:   state => { return state.showColors ? "bg-pink"    : '' },
    purple: state => { return state.showColors ? "bg-purple"  : '' },
    red:    state => { return state.showColors ? "bg-red"     : '' },
    yellow: state => { return state.showColors ? "bg-yellow"  : '' },
}

export default {
    namespaced: true,
    state,
    getters
}
