// qna-write : 글쓰기 폼 제출
// 제출 후 qna-list.html로 이동 (sessionStorage로 신규 글 전달)
document.getElementById('btnSubmit').addEventListener('click', () => {
  const title   = document.getElementById('writeTitle').value.trim();
  const body    = document.getElementById('writeBody').value.trim();
  const company = document.getElementById('writeCompanyFilter').value;

  if (!title) { alert('제목을 입력해주세요.'); return; }
  if (!company) { alert('기업을 선택해주세요.'); return; }

  // 신규 게시글을 sessionStorage에 저장 → qna-list에서 읽어서 반영
  const newPost = {
    id: Date.now(),
    num: Math.floor(Math.random() * 100) + 1,
    title,
    body,
    company,
    date: new Date().toLocaleDateString('ko-KR').replace(/\. /g,'.').replace('.',''),
    views: 0,
    badge: 'wait',
    notice: false,
  };

  const existing = JSON.parse(sessionStorage.getItem('newPosts') || '[]');
  existing.unshift(newPost);
  sessionStorage.setItem('newPosts', JSON.stringify(existing));

  location.href = 'qna-list.html';
});