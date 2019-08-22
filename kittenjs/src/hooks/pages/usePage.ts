import { useIndicator } from './useIndicator'
import { useFilter } from './useFilter'
import { useModal } from './useModal'
import { useParams } from './useParams'
export default function usePage() {
    const indicator = useIndicator()
    const filter = useFilter()
    const modal = useModal()
    const params = useParams()
    return {
        ...indicator,
        ...filter,
        ...modal,
        ...params
    }
}