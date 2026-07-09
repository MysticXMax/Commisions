(() => {
  "use strict";

  const currentYear = new Date().getFullYear();

  const offers = [
    {
      id: "new-year",
      name: `New Year ${currentYear}`,
      start: [1, 1],
      end: [1, 6],
      discount: 10,
      code: `NEWYEAR${String(currentYear).slice(2)}`,
      copy: "Fresh-year avatar edits, file cleanup, and new look planning.",
      dates: "Jan 1 - Jan 6",
      description: "10% off fresh avatar edits, file cleanup, and planning.",
    },
    {
      id: "spring-sale",
      name: `Spring ${currentYear}`,
      start: [3, 20],
      end: [4, 5],
      discount: 10,
      code: `SPRING${String(currentYear).slice(2)}`,
      copy: "Bright texture edits and fresh spring style changes.",
      dates: "Mar 20 - Apr 5",
      description: "10% off bright texture edits and fresh style changes.",
    },
    {
      id: "summer-sale",
      name: `Summer ${currentYear}`,
      start: [6, 10],
      end: [6, 24],
      discount: 12,
      code: `SUMMER${String(currentYear).slice(2)}`,
      copy: "Emission, Audiolink direction, and soft glow work.",
      dates: "Jun 10 - Jun 24",
      description:
        "12% off emissions, Audiolink direction, and soft glow work.",
    },
    {
      id: "black-friday",
      name: `Black Friday ${currentYear}`,
      start: [11, 15],
      end: [11, 29],
      discount: 20,
      code: `BLACK${String(currentYear).slice(2)}`,
      copy: "Gift-ready commissions booked before the December rush.",
      dates: "Nov 15 - Nov 29",
      description:
        "20% off gift-ready commissions booked before the December rush.",
    },
    {
      id: "holiday-prep",
      name: `Holiday Prep ${currentYear}`,
      start: [11, 30],
      end: [12, 6],
      discount: 15,
      code: `HOLIDAY${String(currentYear).slice(2)}`,
      copy: "Premium and higher setup requests during Holiday Prep Week.",
      minimumPrice: 20,
      dates: "Nov 30 - Dec 6",
      description: "15% off Premium and higher setup requests.",
    },
    {
      id: "christmas-warmup",
      name: `Christmas ${currentYear}`,
      start: [12, 7],
      end: [12, 19],
      discount: 18,
      code: `WARM${String(currentYear).slice(2)}`,
      copy: "Final pre-Christmas planning slots before the holiday queue closes.",
      dates: "Dec 7 - Dec 19",
      description:
        "18% off final pre-Christmas planning before the queue closes.",
    },
    {
      id: "christmas",
      name: `Christmas Thank You ${currentYear}`,
      start: [12, 20],
      end: [12, 26],
      discount: 25,
      code: `XMAS${String(currentYear).slice(2)}`,
      copy: "New-year planning deposits while holiday slots last.",
      dates: "Dec 20 - Dec 26",
      description:
        "25% off new-year planning deposits while holiday slots last.",
    },
  ];

  const getClosureDates = (year) => {
    return [
      {
        name: "Winter Break",
        start: new Date(year, 11, 20, 0, 0, 0),
        end: new Date(year + 1, 0, 5, 23, 59, 59),
      },
      {
        name: "Spring Break",
        start: new Date(year, 2, 15, 0, 0, 0),
        end: new Date(year, 2, 22, 23, 59, 59),
      },
      {
        name: "Summer Break",
        start: new Date(year, 5, 1, 0, 0, 0),
        end: new Date(year, 6, 1, 23, 59, 59),
      },
    ];
  };

  const saleTitle = document.querySelector("[data-sale-title]");
  const saleCopy = document.querySelector("[data-sale-copy]");
  const saleCode = document.querySelector("[data-sale-code]");
  const saleCountdown = document.querySelector("[data-sale-countdown]");
  const overlayClosed = document.getElementById("overlay-closed");
  const closedContent = document.querySelector("[data-closed-content]");
  const offerGrid = document.getElementById("offerGrid");

  const renderOfferCards = () => {
    if (!offerGrid) return;
    offerGrid.innerHTML = "";
    offers.forEach((offer) => {
      const article = document.createElement("article");
      article.className = "offer-card";
      article.dataset.offerCard = offer.id;
      article.innerHTML = `
        <span>${offer.dates}</span>
        <h3>${offer.name}</h3>
        <p>${offer.description}</p>
        <strong data-offer-code="${offer.id}">Loading...</strong>
      `;
      offerGrid.appendChild(article);
    });
  };

  const makeDate = (year, pair, endOfDay = false) => {
    const [month, day] = pair;
    return new Date(
      year,
      month - 1,
      day,
      endOfDay ? 23 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 59 : 0,
    );
  };

  const rangeFor = (offer, year) => {
    const start = makeDate(year, offer.start);
    const end = makeDate(year, offer.end, true);
    return { offer, start, end };
  };

  const allRanges = (now) => {
    const year = now.getFullYear();
    const ranges = [];
    offers.forEach((offer) => {
      const range = rangeFor(offer, year);
      if (range.end >= range.start) {
        ranges.push(range);
      }
    });
    return ranges;
  };

  const getOfferState = (now = new Date()) => {
    const ranges = allRanges(now);
    const current = ranges
      .filter((range) => now >= range.start && now <= range.end)
      .sort((a, b) => b.offer.discount - a.offer.discount)[0];
    const next = ranges
      .filter((range) => range.start > now)
      .sort((a, b) => a.start - b.start)[0];
    const ended = ranges
      .filter((range) => range.end < now)
      .sort((a, b) => b.end - a.end);
    return { current: current || null, next: next || null, ended: ended || [] };
  };

  const getClosureState = (now = new Date()) => {
    const year = now.getFullYear();
    const closures = getClosureDates(year);
    const current = closures.find(
      (period) => now >= period.start && now <= period.end,
    );
    const next = closures
      .filter((period) => period.start > now)
      .sort((a, b) => a.start - b.start)[0];
    return { current: current || null, next: next || null };
  };

  const formatDuration = (milliseconds) => {
    const safe = Math.max(0, milliseconds);
    const days = Math.floor(safe / 86400000);
    const hours = Math.floor((safe % 86400000) / 3600000);
    const minutes = Math.floor((safe % 3600000) / 60000);
    const seconds = Math.floor((safe % 60000) / 1000);
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-FI", {
      month: "short",
      day: "numeric",
    });

  const setText = (node, value) => {
    if (node) node.textContent = value;
  };

  const updateOfferCodes = () => {
    document.querySelectorAll("[data-offer-code]").forEach((el) => {
      const offerId = el.dataset.offerCode;
      const offer = offers.find((o) => o.id === offerId);
      if (offer) {
        el.textContent = `Code ${offer.code}`;
      }
    });
  };

  const updateOfferCards = (current, next, ended) => {
    document.querySelectorAll("[data-offer-card]").forEach((card) => {
      const cardId = card.dataset.offerCard;
      const isEnded = ended.some((e) => e.offer.id === cardId);
      const isActive = current?.offer.id === cardId;
      const isNext = !current && next?.offer.id === cardId;

      card.classList.toggle("is-active", isActive);
      card.classList.toggle("is-next", isNext);
      card.classList.toggle("is-ended", isEnded && !isActive);
    });
  };

  const updateSaleBanner = (state) => {
    const { current, next, ended } = state;

    if (current) {
      const { offer, end } = current;
      setText(saleTitle, `${offer.name} is live`);
      setText(saleCopy, `${offer.discount}% off ${offer.copy}`);
      setText(saleCode, `Use ${offer.code}`);
      setText(saleCountdown, `Ends in ${formatDuration(end - new Date())}`);
      updateOfferCards(current, next, ended);
      return;
    }

    if (ended.length > 0 && !current) {
      const latestEnded = ended[0];
      const { offer } = latestEnded;
      setText(saleTitle, `${offer.name} has ended`);
      setText(saleCopy, `This offer has expired. Check back for new deals.`);
      setText(saleCode, `Code expired`);
      setText(saleCountdown, `Ended`);
      updateOfferCards(null, next, ended);
      return;
    }

    if (next) {
      const { offer, start } = next;
      setText(saleTitle, `Next offer: ${offer.name}`);
      setText(saleCopy, `${offer.discount}% off ${offer.copy}`);
      setText(saleCode, `Code ${offer.code}`);
      setText(saleCountdown, `Starts ${formatDate(start)}`);
      updateOfferCards(null, next, ended);
      return;
    }

    setText(saleTitle, "Seasonal offers are being planned");
    setText(saleCopy, "New holiday discounts will appear here when scheduled.");
    setText(saleCode, "No active code");
    setText(saleCountdown, "Open now");
    updateOfferCards(null, null, ended);
  };

  const updateClosureOverlay = (state) => {
    if (!overlayClosed || !closedContent) return;

    if (!state.current) {
      overlayClosed.classList.add("hidden");
      document.body.classList.remove("no-scroll");
      return;
    }

    const title = document.createElement("h2");
    const reason = document.createElement("p");
    const reopens = document.createElement("p");
    title.textContent = "Commissions closed";
    reason.textContent = `Reason: ${state.current.name}`;
    reopens.textContent = `Reopens in ${formatDuration(state.current.end - new Date())}`;
    closedContent.replaceChildren(title, reason, reopens);
    overlayClosed.classList.remove("hidden");
    document.body.classList.add("no-scroll");
  };

  const render = () => {
    const now = new Date();
    const offerState = getOfferState(now);
    const closureState = getClosureState(now);
    updateOfferCodes();
    updateSaleBanner(offerState);
    updateClosureOverlay(closureState);
    document.dispatchEvent(
      new CustomEvent("mystic-offer-change", {
        detail: {
          current: offerState.current?.offer || null,
          next: offerState.next?.offer || null,
          ended: offerState.ended.map((e) => e.offer) || [],
        },
      }),
    );
  };

  window.MysticOffers = {
    offers,
    getCurrentOffer: () => getOfferState().current?.offer || null,
    getNextOffer: () => getOfferState().next?.offer || null,
    getEndedOffers: () => getOfferState().ended.map((e) => e.offer) || [],
  };

  renderOfferCards();
  render();
  setInterval(render, 1000);
})();
