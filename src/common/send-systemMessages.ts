export const SendSystemMessage = {
    GET_FINISHED_NEGO: (name) => {
        `"${name}"님이 신청하신 견적 신청이 완료되었습니다. 견적 리스트를 확인해주세요!`
    },

    GET_USER_PICK: '기사님의 견적서가 채택되었습니다! 예약 내역을 확인해주세요!!',

    FINISH_MOVING: (who) => {
        `${who}님이 이사완료 확인을 하셨습니다! 완료가 되셨다면 확인을 눌러 이사를 완료해 주세요!`
    }
}