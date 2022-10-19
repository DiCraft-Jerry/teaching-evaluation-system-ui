import { number, string } from "mathjs";

export default {
    namespaced: true,
    state: () => ({
        matchResult: [],
        area: number,
    }),
    mutations: {
        addMatchResult(state: any, value: any) {
            state.matchResult = value.matchResult;
            state.area = value.values.area;
        },
        clearMatchResult(state: any) {
            state.matchResult = [];
            state.area = undefined;
        }

    }

}