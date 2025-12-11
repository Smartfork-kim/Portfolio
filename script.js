import { products, history, companyInfo, aiCurriculum, outsourcingInfo, competitiveEdge, businessDivisions } from './data.js';

document.addEventListener('DOMContentLoaded', () => {

    lucide.createIcons();


    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            initAnimations();
        }, 500);
    }, 800);


    const html = document.documentElement;
    const toggleBtns = [document.getElementById('dark-mode-toggle'), document.getElementById('mobile-dark-toggle')];
    

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    toggleBtns.forEach(btn => {
        if(btn) {
            btn.addEventListener('click', () => {
                html.classList.toggle('dark');
                if (html.classList.contains('dark')) {
                    localStorage.theme = 'dark';
                } else {
                    localStorage.theme = 'light';
                }
            });
        }
    });


    const businessTabs = document.getElementById('business-tabs');
    const businessContent = document.getElementById('business-content');

    if(businessTabs && businessContent) {

        businessDivisions.forEach((biz, index) => {
            const btn = document.createElement('button');
            btn.className = `px-6 py-3 rounded-full text-sm font-bold transition-all border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 ${index === 0 ? 'bg-black text-white dark:bg-white dark:text-black ring-2 ring-offset-2 ring-black dark:ring-white' : 'text-gray-600 dark:text-gray-400 bg-white dark:bg-dark-surface'}`;
            btn.textContent = biz.title;
            btn.dataset.id = biz.id;
            
            btn.addEventListener('click', () => {

                Array.from(businessTabs.children).forEach(b => {
                    b.className = "px-6 py-3 rounded-full text-sm font-bold transition-all border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 bg-white dark:bg-dark-surface";
                });
                btn.className = "px-6 py-3 rounded-full text-sm font-bold transition-all border border-gray-200 dark:border-gray-700 bg-black text-white dark:bg-white dark:text-black ring-2 ring-offset-2 ring-black dark:ring-white";
                

                gsap.to(businessContent, { opacity: 0, y: 10, duration: 0.3, onComplete: () => {
                    renderBusinessContent(biz);
                    gsap.to(businessContent, { opacity: 1, y: 0, duration: 0.3 });
                }});
            });
            
            businessTabs.appendChild(btn);
        });


        renderBusinessContent(businessDivisions[0]);
    }

    function renderBusinessContent(biz) {
        businessContent.innerHTML = `
            <div class="flex flex-col md:flex-row h-full">
                <div class="md:w-1/2 p-10 flex flex-col justify-center">
                    <div class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6 text-[#E6007E]">
                        <i data-lucide="${biz.icon}" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-3xl font-bold mb-2 dark:text-white">${biz.title}</h3>
                    <p class="text-[#FF9900] font-bold text-sm mb-6 uppercase tracking-wider">${biz.subtitle}</p>
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">${biz.desc}</p>
                    <div>
                        <a href="${biz.link}" class="inline-flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white border-b-2 border-[#E6007E] pb-1 hover:text-[#E6007E] transition-colors">
                            자세히 보기 <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </a>
                    </div>
                </div>
                <div class="md:w-1/2 min-h-[300px]">
                    <img src="${biz.image}" alt="${biz.title}" class="w-full h-full object-cover">
                </div>
            </div>
        `;
        lucide.createIcons();
    }


    const statsContainer = document.getElementById('stats-container');
    companyInfo.stats.forEach(stat => {
        const div = document.createElement('div');
        div.className = "text-center p-6 bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover-lift";
        div.innerHTML = `
            <h3 class="text-4xl font-bold text-gradient mb-2 font-montserrat counter" data-target="${parseInt(stat.value)}">${stat.value}</h3>
            <p class="text-gray-600 dark:text-gray-400 font-medium">${stat.label}</p>
        `;
        statsContainer.appendChild(div);
    });


    const edgeGrid = document.getElementById('edge-grid');
    competitiveEdge.forEach(edge => {
        const div = document.createElement('div');
        div.className = "bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover-lift group relative overflow-hidden";
        div.innerHTML = `
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100/50 to-pink-100/50 dark:from-white/5 dark:to-white/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-700"></div>
            <div class="w-14 h-14 bg-gradient-to-br from-[#FF9900] to-[#E6007E] text-white rounded-xl flex items-center justify-center shadow-lg mb-6 relative z-10">
                <i data-lucide="${edge.icon}" class="w-7 h-7"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">${edge.title}</h3>
            <p class="text-xs font-bold text-[#E6007E] tracking-wider mb-4 font-montserrat uppercase relative z-10">${edge.subtitle}</p>
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed relative z-10">${edge.desc}</p>
        `;
        edgeGrid.appendChild(div);
    });


    const productGrid = document.getElementById('product-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    function renderProducts(category) {
        productGrid.innerHTML = '';
        const filtered = category === 'All' 
            ? products 
            : products.filter(p => p.category === category);

        if(filtered.length === 0) {
            productGrid.innerHTML = `<div class="col-span-full text-center py-10 text-gray-400">해당 카테고리의 제품이 준비 중입니다.</div>`;
            return;
        }

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = "bg-white dark:bg-dark-surface rounded-xl overflow-hidden shadow-lg hover-lift group cursor-pointer opacity-0 translate-y-4 product-card border border-transparent dark:border-gray-700";
            card.onclick = () => openModal(p);
            card.innerHTML = `
                <div class="relative overflow-hidden aspect-[4/5] bg-gray-100 dark:bg-gray-800">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy">
                    <div class="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm font-bold tracking-wide z-10">
                        ${p.category}
                    </div>
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                            <i data-lucide="plus" class="w-6 h-6 text-black"></i>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">${p.name}</h3>
                    </div>
                    ${p.tag ? `<span class="inline-block mb-3 text-[10px] font-bold text-[#E6007E] bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded uppercase tracking-wider">${p.tag}</span>` : ''}
                    <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 h-10">${p.desc}</p>
                </div>
            `;
            productGrid.appendChild(card);
        });
        
        lucide.createIcons();

        gsap.to('.product-card', {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {

                if (html.classList.contains('dark')) {
                     b.classList.remove('bg-white', 'text-black');
                     b.classList.add('bg-gray-800', 'text-gray-300');
                } else {
                     b.classList.remove('bg-black', 'text-white');
                     b.classList.add('bg-white', 'text-gray-700');
                }
            });

             if (html.classList.contains('dark')) {
                btn.classList.remove('bg-gray-800', 'text-gray-300');
                btn.classList.add('bg-white', 'text-black');
             } else {
                btn.classList.remove('bg-white', 'text-gray-700');
                btn.classList.add('bg-black', 'text-white');
             }
            
            renderProducts(btn.dataset.category);
        });
    });

    renderProducts('All');


    const modal = document.getElementById('product-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalClose = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-content');

    function openModal(product) {
        document.getElementById('modal-img').src = product.image;
        document.getElementById('modal-category').textContent = product.category;
        document.getElementById('modal-title').textContent = product.name;
        document.getElementById('modal-desc').textContent = product.desc;
        document.getElementById('modal-detail').textContent = product.detail || "상세 정보가 준비 중입니다.";
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        

        requestAnimationFrame(() => {
            modalContent.classList.remove('opacity-0', 'scale-95');
            modalContent.classList.add('opacity-100', 'scale-100');
        });
        
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalContent.classList.remove('opacity-100', 'scale-100');
        modalContent.classList.add('opacity-0', 'scale-95');
        
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }, 300);
    }

    modalBackdrop.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);


    const aiGrid = document.getElementById('ai-grid');
    aiCurriculum.forEach(curr => {
        const div = document.createElement('div');
        div.className = "bg-gray-50 dark:bg-dark-surface rounded-2xl p-8 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-600 group";
        div.innerHTML = `
            <div class="w-14 h-14 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-sm mb-6 text-[#E6007E] group-hover:scale-110 transition-transform">
                <i data-lucide="${curr.icon}" class="w-7 h-7"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">${curr.title}</h3>
            <p class="text-sm text-[#FF9900] font-bold mb-4 font-montserrat">${curr.subtitle}</p>
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">${curr.desc}</p>
        `;
        aiGrid.appendChild(div);
    });
    

    const processList = document.getElementById('process-list');
    outsourcingInfo.process.forEach((proc) => {
        const div = document.createElement('div');
        div.className = "flex items-center gap-6 p-4 rounded-xl hover:bg-white/5 transition-colors";
        div.innerHTML = `
            <span class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9900] to-[#E6007E] font-montserrat">${proc.step}</span>
            <div>
                <h4 class="font-bold text-lg text-white">${proc.title}</h4>
                <p class="text-sm text-gray-400">${proc.desc}</p>
            </div>
        `;
        processList.appendChild(div);
    });


    const historyContainer = document.getElementById('history-container');
    history.forEach((item) => {
        const row = document.createElement('div');
        row.className = "relative pl-12 history-item";
        row.innerHTML = `
            <!-- Dot -->
            <div class="absolute left-[19px] md:left-[21px] top-2 w-4 h-4 rounded-full bg-white dark:bg-dark-surface border-4 border-gray-300 dark:border-gray-600 z-10 transition-colors duration-500 history-dot"></div>
            
            <!-- Content -->
            <div class="flex flex-col sm:flex-row gap-4 sm:items-start group">
                <div class="sm:w-24 flex-shrink-0">
                    <span class="text-2xl font-bold text-gray-300 dark:text-gray-600 font-montserrat group-hover:text-[#E6007E] transition-colors">${item.year}</span>
                </div>
                <div class="bg-gray-50 dark:bg-dark-surface p-6 rounded-xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all flex-grow border border-gray-100 dark:border-gray-700">
                    <h5 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">${item.title}</h5>
                    <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">${item.desc}</p>
                </div>
            </div>
        `;
        historyContainer.appendChild(row);
    });

    lucide.createIcons(); // Re-run


    const nav = document.getElementById('main-nav');
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('glass-nav', 'shadow-sm');
            nav.classList.remove('bg-transparent', 'border-transparent');
            if(html.classList.contains('dark')) {
                nav.classList.add('border-b', 'border-white/5');
            } else {
                nav.classList.add('border-b', 'border-black/5');
            }
        } else {
            nav.classList.remove('glass-nav', 'shadow-sm', 'border-b', 'border-black/5', 'border-white/5');
            nav.classList.add('bg-transparent', 'border-transparent');
        }


        if (window.scrollY > 500) {
            backToTopBtn.classList.remove('translate-y-24', 'opacity-0');
        } else {
            backToTopBtn.classList.add('translate-y-24', 'opacity-0');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            mobileMenu.classList.add('hidden');
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });


    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = '전송 중...';
            btn.disabled = true;
            

            setTimeout(() => {
                alert('문의가 성공적으로 접수되었습니다. 담당자가 곧 연락드리겠습니다.');
                btn.textContent = originalText;
                btn.disabled = false;
                contactForm.reset();
            }, 1500);
        });
    }
});

function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);


    gsap.from("#hero-content > *", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });


    gsap.utils.toArray('section h2').forEach(h2 => {
        gsap.from(h2, {
            scrollTrigger: {
                trigger: h2,
                start: "top 90%",
            },
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out"
        });
    });
    

    gsap.utils.toArray('.reveal-left').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 85%" },
            x: -50, opacity: 0, duration: 1, ease: "power3.out"
        });
    });
    
    gsap.utils.toArray('.reveal-right').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 85%" },
            x: 50, opacity: 0, duration: 1, ease: "power3.out"
        });
    });

    gsap.utils.toArray('.reveal-bottom').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 85%" },
            y: 50, opacity: 0, duration: 1, ease: "power3.out"
        });
    });


    const timelineProgress = document.getElementById('timeline-progress');
    const historySection = document.getElementById('history-container');
    
    if (timelineProgress && historySection) {
        ScrollTrigger.create({
            trigger: historySection,
            start: "top 70%",
            end: "bottom 70%",
            onUpdate: (self) => {
                const height = self.progress * 100;
                timelineProgress.style.height = `${height}%`;
            }
        });


        const dots = document.querySelectorAll('.history-dot');
        const years = document.querySelectorAll('.history-item span.font-montserrat');
        
        gsap.utils.toArray('.history-item').forEach((item, i) => {
            ScrollTrigger.create({
                trigger: item,
                start: "top 75%",
                onEnter: () => {
                    if(dots[i]) {
                        dots[i].style.borderColor = '#E6007E';
                        dots[i].style.backgroundColor = '#FF9900';
                    }
                    if(years[i]) {
                        years[i].classList.add('text-[#E6007E]');
                        years[i].classList.remove('text-gray-300', 'dark:text-gray-600');
                    }
                    gsap.fromTo(item.querySelector('div.bg-gray-50, div.dark\\:bg-dark-surface'), 
                        { y: 20, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.5 }
                    );
                },
                onLeaveBack: () => {
                    if(dots[i]) {
                        dots[i].style.borderColor = ''; // reset to class default
                        dots[i].style.backgroundColor = '';
                    }
                    if(years[i]) {
                        years[i].classList.remove('text-[#E6007E]');
                        years[i].classList.add('text-gray-300', 'dark:text-gray-600');
                    }
                }
            });
        });
    }


    gsap.utils.toArray('#edge-grid > div, #ai-grid > div').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        });
    });
}
