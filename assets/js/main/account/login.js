const loginForm = document.getElementById('loginForm');
    const loginErrorMsg = document.getElementById('loginErrorMsg');

    loginForm.addEventListener('submit', function(event) {
      event.preventDefault(); // 기본 폼 제출 방지

      const userId = document.getElementById('loginId').value;
      const userPw = document.getElementById('loginPw').value;

      // 차후 백엔드 또는 DB 연동 시 이 부분에서 검증
      // 지금은 무조건 성공하는 것으로 가정하여 메인페이지로 이동
      if (userId && userPw) {
        // [JS 연동] 실제 메인페이지 파일명으로 수정 필요
        window.location.href = "mainpage-login"; 
      } else {
        // 에러 상황 테스트 시 에러메시지 노출 예시
        // loginErrorMsg.style.display = 'block';
      }
    });