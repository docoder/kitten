import { useIndicator } from './useIndicator'
import { useFilter } from './useFilter'
import { useModal } from './useModal'
export default function usePage() {
    const indicator = useIndicator()
    const filter = useFilter()
    const modal = useModal()
    return {
        ...indicator,
        ...filter,
        ...modal
    }
}