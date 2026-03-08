// qna-list : 게시글 목록 데이터 (실제 서비스에서는 API로 교체)
const posts = [
  { id: 'notice', num: '공지', title: '공지사항', company: '관리자', date: '700202', views: 1235, badge: null, notice: true },
  { id: 1, num: 1, title: '꼬으으응 뭘적지', company: '디노기', date: '260302', views: 191, badge: 'wait' },
  { id: 2, num: 2, title: '꼬으으응 뭘적지', company: '디노기', date: '260303', views: 192, badge: 'done' },
  { id: 3, num: 3, title: '꼬으으응 뭘적지', company: '디노기', date: '260304', views: 193, badge: 'wait' },
  { id: 4, num: 4, title: '꼬으으응 뭘적지', company: '디노기', date: '260305', views: 194, badge: 'wait' },
  { id: 5, num: 5, title: '꼬으으응 뭘적지', company: '디노기', date: '260306', views: 195, badge: 'wait' },
];

// sessionStorage에서 신규 글 불러오기 (qna-write.js에서 저장)
const savedPosts = JSON.parse(sessionStorage.getItem('newPosts') || '[]');
savedPosts.forEach(p => {
  // 중복 방지: 같은 id가 없을 때만 추가
  if (!posts.find(existing => existing.id === p.id)) {
    posts.splice(1, 0, p); // 공지 바로 아래에 삽입
  }
});

const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let filteredPosts = [...posts];

// qna-list-tbl tbody 렌더링
function renderTable(page) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const notices = filteredPosts.filter(p => p.notice);
  const normal  = filteredPosts.filter(p => !p.notice).slice(start, start + ITEMS_PER_PAGE);
  const items   = page === 1 ? [...notices, ...normal] : normal;

  document.getElementById('qnaTableBody').innerHTML = items.map(p => `
    <tr class="${p.notice ? 'qna-list-tbl-notice' : ''}"
        onclick="location.href='qna-detail.html?id=${p.id}'">
      <td class="qna-list-tbl-num">${p.notice ? '공지' : p.num}</td>
      <td class="${!p.notice && p.views > 100 ? 'qna-list-tbl-title-hot' : ''}">${p.title}</td>
      <td>${p.company}</td>
      <td>${p.date}</td>
      <td>${p.views}</td>
      <td>${p.badge
        ? `<span class="qna-list-tbl-badge qna-list-tbl-badge-${p.badge}">${p.badge === 'done' ? '답변완료' : '답변대기'}</span>`
        : ''}</td>
    </tr>
  `).join('');
}

// qna-list-pg 페이지네이션 렌더링
function renderPagination(page) {
  const total = Math.max(1, Math.ceil(filteredPosts.filter(p => !p.notice).length / ITEMS_PER_PAGE));
  const container = document.getElementById('qnaPagination');
  let html = `<button ${page === 1 ? 'disabled' : ''} onclick="goToPage(${page-1})">&lt;</button>`;
  for (let i = 1; i <= total; i++) {
    html += `<button class="${i === page ? 'qna-list-pg-active':''}" onclick="goToPage(${i})">${i}</button>`;
  }
  html += `<button ${page === total ? 'disabled' : ''} onclick="goToPage(${page+1})">&gt;</button>`;
  container.innerHTML = html;
}

function goToPage(page) {
  const total = Math.max(1, Math.ceil(filteredPosts.filter(p => !p.notice).length / ITEMS_PER_PAGE));
  if (page < 1 || page > total) return;
  currentPage = page;
  renderTable(currentPage);
  renderPagination(currentPage);
}

// 기업 필터
document.getElementById('companyFilter').addEventListener('change', function () {
  filteredPosts = this.value
    ? posts.filter(p => p.company === this.value || p.notice)
    : [...posts];
  currentPage = 1;
  renderTable(1); renderPagination(1);
});

// 검색
document.getElementById('btnSearch').addEventListener('click', () => {
  const kw = document.getElementById('searchInput').value.trim().toLowerCase();
  filteredPosts = kw
    ? posts.filter(p => p.notice || p.title.toLowerCase().includes(kw))
    : [...posts];
  currentPage = 1;
  renderTable(1); renderPagination(1);
});

renderTable(currentPage);
renderPagination(currentPage);