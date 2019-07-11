import useIndicator from './useIndicator'
import useFilter from './useFilter'
export default function usePage() {
    const indicator = useIndicator()
    const filter = useFilter()
    return {
        ...indicator,
        ...filter
    }
}