document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- 스크롤 등장 효과 ---------- */
const revealTargets = document.querySelectorAll(
  ".section-heading, .featured-project, .project-card, .principle-list li"
);

if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("reveal-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((element) => observer.observe(element));
}

/* ---------- 프로젝트 상세 모달 ---------- */
const supportsDialog = typeof HTMLDialogElement === "function";

document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
  const dialog = document.getElementById(trigger.dataset.openModal);
  if (!dialog) return;

  // <dialog>를 지원하지 않는 브라우저에서는 저장소 링크로 대체한다.
  if (!supportsDialog) {
    const repo = dialog.querySelector(".detail-links a[href]");
    if (repo) {
      const fallback = document.createElement("a");
      fallback.className = trigger.className;
      fallback.href = repo.href;
      fallback.target = "_blank";
      fallback.rel = "noreferrer";
      fallback.innerHTML = trigger.innerHTML;
      trigger.replaceWith(fallback);
    }
    return;
  }

  trigger.addEventListener("click", () => openDetail(dialog));
});

// 모달마다 고유 주소를 준다. #mes 처럼 링크를 걸면 해당 상세가 열린 채로 시작한다.
function slugOf(dialog) {
  return dialog.id.replace(/^modal-/, "");
}

function openDetail(dialog) {
  dialog.showModal();
  document.body.classList.add("modal-open");
  history.replaceState(null, "", "#" + slugOf(dialog));
}

document.querySelectorAll("dialog.detail").forEach((dialog) => {
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (location.hash.slice(1) === slugOf(dialog)) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  });

  // 배경(backdrop)을 눌렀을 때 닫기. 내용 영역 클릭은 그대로 둔다.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

// 주소에 #mes 등이 붙은 채로 열렸으면 해당 상세를 바로 띄운다.
if (supportsDialog && location.hash.length > 1) {
  const target = document.getElementById("modal-" + location.hash.slice(1));
  if (target && target.matches("dialog.detail")) openDetail(target);
}
