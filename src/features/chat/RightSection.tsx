import type {RootState} from '../../store'
import {useAppSelector} from '../../hooks'
export function RightSection() {
    const chatData = useAppSelector((state: RootState) => state.chatData)
    return (
        <div className={'left-section-container'}>
            <div className={'right-section-heading'}>
                <span>
                {chatData.rightSectionTitle || "No Title"}
                </span>
            </div>
        </div>
    )
}