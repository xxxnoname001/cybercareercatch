/*
  =============================================================
  [기능 설명]
  1. 전체동의 체크박스 클릭 시 모든 개별 약관 체크/해제
  2. 개별 약관 체크 시 전체동의 체크박스 상태 자동 업데이트
  3. '다음단계로' 버튼 클릭 시 필수 항목 체크 여부 확인 후 알림 또는 페이지 이동
  =============================================================
*/

document.addEventListener("DOMContentLoaded", function() {
  const formCom = document.getElementById('userAgreeComForm');
  const chkAllCom = document.getElementById('chkAllCom');
  const reqCheckboxesCom = document.querySelectorAll('.req-checkbox-com');

  // 1. 전체동의 체크박스 클릭 시 동작
  chkAllCom.addEventListener('change', function() {
    const isChecked = this.checked;
    reqCheckboxesCom.forEach(function(checkbox) {
      checkbox.checked = isChecked;
    });
  });

  // 2. 개별 체크박스 클릭 시 전체동의 상태 업데이트
  reqCheckboxesCom.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      let allChecked = true;
      reqCheckboxesCom.forEach(function(chk) {
        if (!chk.checked) allChecked = false;
      });
      chkAllCom.checked = allChecked;
    });
  });

  // 3. 폼 제출(다음단계로 버튼) 시 필수 체크 확인
  formCom.addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 폼 제출 동작(새로고침) 방지
    
    let isAllChecked = true;
    reqCheckboxesCom.forEach(function(checkbox) {
      if (!checkbox.checked) {
        isAllChecked = false;
      }
    });

    if (!isAllChecked) {
      alert("동의란을 체크해주세요");
    } else {
      // 모두 체크되었을 때, 실제 기업 회원가입 입력 페이지로 연결
      window.location.href = "signup-company.html"; 
    }
  });
});