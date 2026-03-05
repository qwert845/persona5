document.addEventListener("DOMContentLoaded", () => {
    // 0. 초기 로딩 및 진입 애니메이션 작동
    setTimeout(() => {
        document.body.classList.add("loaded");
        document.querySelectorAll(".animate-entrance").forEach(el => {
            el.classList.add("entered");
        });
    }, 100);

    // 0.5 링크 클릭 트랜지션 인터셉트
    const links = document.querySelectorAll("a.nav-link, a.back-link");
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetUrl = link.getAttribute("href");
            if (targetUrl && targetUrl !== "#" && !targetUrl.startsWith("http")) {
                e.preventDefault();
                const wipe = document.getElementById("transition-wipe");

                // 트랜지션을 즉시 끄고 왼쪽으로 오버레이 이동
                wipe.style.transition = "none";
                wipe.style.transform = "translateX(-120vw) skewX(-25deg)";

                // 브라우저 렌더링 강제 업데이트를 위해 리플로우 발생
                void wipe.offsetWidth;

                // 트랜지션을 다시 켜고 가운데로 이동 애니메이션 수행
                wipe.style.transition = "transform 0.5s cubic-bezier(0.8, 0, 0.2, 1)";
                wipe.style.transform = "translateX(0vw) skewX(-25deg)";

                // 애니메이션이 화면을 덮었을 때 페이지 이동
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 500);
            }
        });
    });

    // 1. 랜섬노트 (Ransom Note) 텍스트 자동 스타일링
    const titleElement = document.getElementById("main-title");
    if (titleElement) {
        const text = titleElement.innerText;
        titleElement.innerHTML = "";

        // 빨강, 검정, 흰색 조합 세트
        const styles = [
            { bg: "var(--p5-red)", color: "var(--p5-white)", border: "var(--p5-black)", shadow: "var(--p5-black)" },
            { bg: "var(--p5-black)", color: "var(--p5-white)", border: "var(--p5-red)", shadow: "var(--p5-red)" },
            { bg: "var(--p5-white)", color: "var(--p5-red)", border: "var(--p5-black)", shadow: "var(--p5-black)" },
            { bg: "var(--p5-red)", color: "var(--p5-black)", border: "var(--p5-white)", shadow: "var(--p5-black)" },
            { bg: "var(--p5-black)", color: "var(--p5-red)", border: "var(--p5-white)", shadow: "var(--p5-white)" }
        ];

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === " ") {
                titleElement.appendChild(document.createTextNode("\u00A0"));
                continue;
            }

            const span = document.createElement("span");
            span.innerText = char;
            span.classList.add("char-box");

            // 무작위 스타일 할당
            const style = styles[Math.floor(Math.random() * styles.length)];
            span.style.backgroundColor = style.bg;
            span.style.color = style.color;
            span.style.border = `5px solid ${style.border}`;
            span.style.boxShadow = `6px 6px 0 ${style.shadow}`;

            // 무작위 회전 및 크기 조절
            const rotation = (Math.random() * 24) - 12; // -12 ~ 12도
            const scale = 0.95 + (Math.random() * 0.15); // 0.95 ~ 1.1
            const translateY = (Math.random() * 14) - 7;

            span.style.transform = `rotate(${rotation}deg) scale(${scale}) translateY(${translateY}px)`;

            titleElement.appendChild(span);
        }
    }

    // 2. 마우스 패럴랙스 효과 (Parallax)
    document.addEventListener("mousemove", (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;

        const star = document.querySelector(".decorative-star");
        const decText = document.querySelector(".decorative-text");
        const menu = document.querySelector(".main-menu");
        const infoBox = document.querySelector(".info-box");

        // 각 요소별로 패럴랙스 속도 및 기본 transform 값 유지
        if (star) star.style.transform = `rotate(20deg) translate(${x * 1.5}px, ${y * 1.5}px)`;
        if (decText) decText.style.transform = `rotate(-5deg) translate(${x * -2}px, ${y * -2}px)`;
        if (menu) menu.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
        if (infoBox) infoBox.style.transform = `rotate(3deg) skewX(-10deg) translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
});
