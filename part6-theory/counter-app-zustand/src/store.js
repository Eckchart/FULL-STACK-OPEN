import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useCounterStore = create(set => ({
  counter: 0,
  changes: 0,
  actions: {
    increment: () => set(state => ({ 
      counter: state.counter + 1, 
      changes: state.changes + 1 
    })),
    decrement: () => set(state => ({ 
      counter: state.counter - 1, 
      changes: state.changes + 1 
    })),
    zero: () => set(state => ({ 
      counter: 0, 
      changes: state.changes + 1 
    })),
  }  
}))

const useCounter = () => useCounterStore(state => state.counter)

const useValues = () => useCounterStore(useShallow((state) => ({
  counter: state.counter,
  changes: state.changes,
})))

const useCounterControls = () => useCounterStore(state => state.actions)

export { useCounter, useValues, useCounterControls }

export default useCounterStore
