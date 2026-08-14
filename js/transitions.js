// Page transitions: stacked-cards sequence — the current page peels away as a
// card, a middle card sweeps through, the next page scales up from beneath.
// Same sequence in both directions, including the browser back button.

/* global barba, gsap, CustomEase */

export function initTransitions({ onEnter } = {}) {
  if (!window.barba || !window.gsap || !window.CustomEase) return;

  gsap.registerPlugin(CustomEase);
  history.scrollRestoration = 'manual';

  const rmMQ = matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = rmMQ.matches;
  rmMQ.addEventListener?.('change', (e) => (reducedMotion = e.matches));

  CustomEase.create('house', '0.625, 0.05, 0, 1');
  gsap.defaults({ ease: 'house', duration: 0.6 });

  function resetPage(container) {
    scrollTo(0, 0);
    gsap.set(container, { clearProps: 'position,top,left,right' });
  }

  function prepareForTransition(parent, current, next) {
    const wrapper = document.createElement('div');
    wrapper.className = 'pt-wrapper';
    parent.insertBefore(wrapper, current);
    wrapper.appendChild(current);

    const scrollY = window.scrollY || 0;
    window.scrollTo(0, 0);

    const ptWrap = document.querySelector('[data-pt-wrap]');
    const ptMiddle = ptWrap.querySelector('[data-pt-middle]');

    gsap.set(parent, {
      perspective: '100vw',
      transformStyle: 'preserve-3d',
      overflow: 'clip',
    });
    gsap.set(wrapper, {
      position: 'fixed',
      top: 0, left: 0, right: 0,
      width: '100%', height: '100vh',
      overflow: 'clip',
      zIndex: 3,
      transformStyle: 'preserve-3d',
      willChange: 'transform',
      clipPath: 'rect(0% 100% 100% 0% round 0em)',
    });
    gsap.set(current, {
      position: 'absolute',
      top: -scrollY, left: 0, width: '100%',
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden',
    });
    gsap.set(ptWrap, { zIndex: 2 });
    gsap.set(ptMiddle, {
      willChange: 'transform, opacity',
      autoAlpha: 1, yPercent: 0, scale: 1,
      clipPath: 'rect(0% 100% 100% 0% round 0em)',
    });
    gsap.set(next, {
      position: 'fixed',
      top: 0, left: 0, right: 0,
      width: '100%', height: '100vh',
      overflow: 'clip',
      zIndex: 1,
      transformStyle: 'preserve-3d',
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden',
      autoAlpha: 1, yPercent: 0, scale: 1,
      clipPath: 'rect(0% 100% 100% 0% round 0em)',
    });

    return { wrapper, scrollY };
  }

  function runPageOnceAnimation(next) {
    const tl = gsap.timeline();
    tl.call(() => resetPage(next), null, 0);
    return tl;
  }

  function runPageLeaveAnimation(current, next) {
    const parent = current.parentElement || document.body;
    const { wrapper } = prepareForTransition(parent, current, next);
    const ptWrap = document.querySelector('[data-pt-wrap]');
    const ptMiddle = ptWrap.querySelector('[data-pt-middle]');

    const tl = gsap.timeline({
      onComplete: () => {
        wrapper.remove();
        gsap.set(parent, { clearProps: 'perspective,transformStyle,overflow' });
        gsap.set(next, { clearProps: 'position,inset,width,height,zIndex,transformStyle,willChange,backfaceVisibility,transform' });
      },
    });

    if (reducedMotion) {
      return tl.set(current, { autoAlpha: 0 });
    }

    tl.to([wrapper, ptMiddle, next], {
      clipPath: 'rect(0% 100% 100% 0% round 1em)',
      duration: 0.8,
    }, 0);
    tl.to(wrapper, {
      scale: '0.95', duration: 1.2, yPercent: 20,
      ease: 'expo.inOut', overwrite: 'auto',
    }, '<');
    tl.to(ptMiddle, {
      scale: '0.875', yPercent: 10, duration: 1.2,
      ease: 'expo.inOut', overwrite: 'auto',
    }, '<');
    tl.to(next, {
      scale: '0.8', yPercent: 0, duration: 1.2,
      ease: 'expo.inOut', overwrite: 'auto',
    }, '<');
    tl.to(wrapper, { yPercent: 130, duration: 1.2, ease: 'house' }, '< 0.9');
    tl.to(ptMiddle, { yPercent: 120, duration: 1.2, ease: 'house' }, '< 0.15');
    tl.to(next, {
      scale: '1', yPercent: 0, duration: 1.2,
      ease: 'expo.inOut', overwrite: 'auto',
    }, '< 0.15');
    tl.to([wrapper, ptMiddle, next], {
      clipPath: 'rect(0% 100% 100% 0% round 0em)',
      duration: 0.8, ease: 'house',
    }, '> -0.8');

    return tl;
  }

  function runPageEnterAnimation(next) {
    const tl = gsap.timeline();
    if (reducedMotion) {
      tl.set(next, { autoAlpha: 1 });
      tl.add('pageReady');
      tl.call(resetPage, [next], 'pageReady');
      return new Promise((resolve) => tl.call(resolve, null, 'pageReady'));
    }
    tl.add('pageReady');
    tl.call(resetPage, [next], 'pageReady');
    return new Promise((resolve) => tl.call(resolve, null, 'pageReady'));
  }

  barba.hooks.beforeEnter((data) => {
    gsap.set(data.next.container, { position: 'fixed', top: 0, left: 0, right: 0 });
  });

  barba.hooks.afterEnter((data) => {
    onEnter?.(data.next.container, data.next.namespace);
  });

  barba.init({
    timeout: 7000,
    preventRunning: true,
    transitions: [
      {
        name: 'default',
        sync: true,
        async once(data) {
          return runPageOnceAnimation(data.next.container);
        },
        async leave(data) {
          return runPageLeaveAnimation(data.current.container, data.next.container);
        },
        async enter(data) {
          return runPageEnterAnimation(data.next.container);
        },
      },
    ],
  });
}
