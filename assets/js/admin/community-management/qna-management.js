document.addEventListener("DOMContentLoaded", function(){

    const questions = document.querySelectorAll(".qnaManagement-question");

    questions.forEach((question) => {

        const input = question.querySelector("input");
        const checkBtn = question.querySelector(".qnaManagement-check");
        const reviseBtn = question.querySelector(".qnaManagement-revise");
        const cancelBtn = question.querySelector(".qnaManagement-cancel");

        let savedValue = "";

        // 확인
        checkBtn.addEventListener("click", function(){

            if(input.value.trim() === ""){
                alert("내용을 입력하세요.");
                return;
            }

            savedValue = input.value;
            input.disabled = true;

            alert("저장되었습니다.");

        });

        // 수정
        reviseBtn.addEventListener("click", function(){

            input.disabled = false;
            input.focus();

        });

        // 취소
        cancelBtn.addEventListener("click", function(){

            input.value = savedValue;

        });

    });

});