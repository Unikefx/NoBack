/**
 * comARATOR - Instagram Follower & Following Comparator & Copy Utility
 * Client-side HTML / JSON / Text Parser and Line-by-Line Copy Box
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const followersDropZone = document.getElementById('followersDropZone');
  const followersFileInput = document.getElementById('followersFileInput');
  const followersTextarea = document.getElementById('followersTextarea');
  const followersCountEl = document.getElementById('followersCount');
  const followersFileLabel = document.getElementById('followersFileLabel');

  const followingDropZone = document.getElementById('followingDropZone');
  const followingFileInput = document.getElementById('followingFileInput');
  const followingTextarea = document.getElementById('followingTextarea');
  const followingCountEl = document.getElementById('followingCount');
  const followingFileLabel = document.getElementById('followingFileLabel');

  const optCaseInsensitive = document.getElementById('optCaseInsensitive');
  const optStripAt = document.getElementById('optStripAt');
  const optTrimSpace = document.getElementById('optTrimSpace');
  const optReverseOrder = document.getElementById('optReverseOrder');
  const btnToggleReverse = document.getElementById('btnToggleReverse');

  optReverseOrder.addEventListener('change', () => {
    if (resultsSection.classList.contains('active')) {
      runComparison();
    }
  });

  btnToggleReverse.addEventListener('click', () => {
    optReverseOrder.checked = !optReverseOrder.checked;
    if (resultsSection.classList.contains('active')) {
      runComparison();
    }
    showToast(optReverseOrder.checked ? 'List order: Bottom to Top (Reversed)' : 'List order: Top to Bottom (Original)');
  });

  const btnCompare = document.getElementById('btnCompare');
  const btnDemo = document.getElementById('btnDemo');
  const btnReset = document.getElementById('btnReset');

  const resultsSection = document.getElementById('resultsSection');
  const statNonFollowers = document.getElementById('statNonFollowers');
  const statFans = document.getElementById('statFans');
  const statMutuals = document.getElementById('statMutuals');

  const countTabNonFollowers = document.getElementById('countTabNonFollowers');
  const countTabFans = document.getElementById('countTabFans');
  const countTabMutuals = document.getElementById('countTabMutuals');
  const countTabAll = document.getElementById('countTabAll');

  const tabsGroup = document.getElementById('tabsGroup');
  const searchInput = document.getElementById('searchInput');

  const copyBoxTitle = document.getElementById('copyBoxTitle');
  const copyBoxBody = document.getElementById('copyBoxBody');
  const btnCopyAll = document.getElementById('btnCopyAll');
  const btnDownload = document.getElementById('btnDownload');
  const toastContainer = document.getElementById('toastContainer');

  // App State
  let analysisState = {
    followers: [],
    following: [],
    nonFollowers: [],
    fans: [],
    mutuals: [],
    allUnique: [],
    activeTab: 'non-followers',
    currentDisplayList: []
  };

  // Demo Instagram HTML Snippets (matching Meta Export format)
  const demoFollowersHTML = `
    <!DOCTYPE html>
    <html><body>
      <h2>Followers</h2>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/alex_photographer">alex_photographer</a><div>Oct 12, 2024</div></div>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/travel_with_sam">travel_with_sam</a><div>Oct 14, 2024</div></div>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/tech_guru_2026">tech_guru_2026</a><div>Nov 01, 2024</div></div>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/design_master_ui">design_master_ui</a><div>Nov 10, 2024</div></div>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/coffee_and_code">coffee_and_code</a><div>Dec 05, 2024</div></div>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/fitness_freak_99">fitness_freak_99</a><div>Dec 20, 2024</div></div>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/daily_quotes_official">daily_quotes_official</a><div>Jan 02, 2025</div></div>
    </body></html>
  `;

  const demoFollowingHTML = `
    <!DOCTYPE html>
    <html><body>
      <h2>Following</h2>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/alex_photographer">alex_photographer</a><div>Oct 12, 2024</div></div>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/travel_with_sam">travel_with_sam</a><div>Oct 14, 2024</div></div>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/elon_musk_fanpage">elon_musk_fanpage</a><div>Nov 15, 2024</div></div>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/future_tech_now">future_tech_now</a><div>Dec 01, 2024</div></div>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/ghost_follower_99">ghost_follower_99</a><div>Dec 10, 2024</div></div>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/coffee_and_code">coffee_and_code</a><div>Dec 18, 2024</div></div>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/influencer_star">influencer_star</a><div>Jan 05, 2025</div></div>
      <div class="_a6-p"><a target="_blank" href="https://www.instagram.com/_u/design_master_ui">design_master_ui</a><div>Jan 12, 2025</div></div>
    </body></html>
  `;

  // Init Event Listeners
  setupFileUpload(followersDropZone, followersFileInput, followersTextarea, followersFileLabel, updateCounts);
  setupFileUpload(followingDropZone, followingFileInput, followingTextarea, followingFileLabel, updateCounts);

  followersTextarea.addEventListener('input', updateCounts);
  followingTextarea.addEventListener('input', updateCounts);

  btnCompare.addEventListener('click', runComparison);
  btnDemo.addEventListener('click', loadDemoData);
  btnReset.addEventListener('click', resetAll);

  tabsGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (typeof isAutoNextRunning !== 'undefined' && isAutoNextRunning) {
      stopAutoNext('Auto Next paused on tab change');
    }

    analysisState.activeTab = btn.dataset.tab;
    renderCopyBox();
  });

  searchInput.addEventListener('input', () => {
    renderCopyBox();
  });

  btnCopyAll.addEventListener('click', copyAllLines);
  btnDownload.addEventListener('click', downloadAsTxt);

  // Auto update handle counts on typing
  function updateCounts() {
    const followers = parseHandles(followersTextarea.value);
    const following = parseHandles(followingTextarea.value);

    followersCountEl.textContent = `${followers.length} account${followers.length === 1 ? '' : 's'}`;
    followingCountEl.textContent = `${following.length} account${following.length === 1 ? '' : 's'}`;
  }

  // File Upload Drag & Drop Handlers
  function setupFileUpload(dropZone, fileInput, textarea, labelEl, onDone) {
    dropZone.addEventListener('click', (e) => {
      if (e.target !== fileInput) {
        fileInput.click();
      }
    });

    fileInput.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0], textarea, labelEl, onDone, fileInput);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        handleFile(e.target.files[0], textarea, labelEl, onDone, fileInput);
      }
    });
  }

  function handleFile(file, textarea, labelEl, onDone, fileInput) {
    labelEl.textContent = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      textarea.value = e.target.result;
      if (fileInput) fileInput.value = '';
      if (onDone) onDone();
      showToast(`Loaded file: ${file.name}`);

      // Auto-trigger comparison if both inputs now have content
      if (followersTextarea.value.trim() && followingTextarea.value.trim()) {
        runComparison();
      }
    };
    reader.readAsText(file);
  }

  // Parse Instagram Usernames from HTML, JSON, or Plain Text
  function parseHandles(rawContent) {
    if (!rawContent || !rawContent.trim()) return [];

    // Strip Byte Order Mark (\uFEFF) and trim
    let content = rawContent.replace(/^\uFEFF/, '').trim();
    const handlesSet = new Set();
    const ignorePaths = new Set([
      '_u', 'explore', 'p', 'stories', 'reels', 'direct', 'accounts',
      'legal', 'about', 'developer', 'directory', 'privacy', 'blog', 'terms',
      'emails', 'graphql', 'create', 'login', 'signup', 'feed', 'html', 'meta',
      'following', 'followers', 'relationships_following', 'relationships_followers',
      'timestamp', 'value', 'href', 'title', 'string_list_data', 'media_list_data',
      'user', 'users', 'account', 'accounts', 'data', 'results', 'items', 'list'
    ]);

    const addIfValid = (candidate) => {
      if (!candidate || typeof candidate !== 'string') return;
      let handle = candidate.trim();
      if (handle.startsWith('@')) handle = handle.substring(1);

      // Strip instagram URL if embedded
      if (handle.includes('instagram.com/')) {
        const parts = handle.split('instagram.com/');
        handle = parts[1] ? parts[1] : handle;
      }
      // Remove _u/ prefix if present
      if (handle.startsWith('_u/')) {
        handle = handle.substring(3);
      }
      // Clean trailing slashes, query params, or anchors
      handle = handle.split('/')[0].split('?')[0].split('#')[0].trim();

      if (
        handle &&
        /^[a-zA-Z0-9_\.]{1,30}$/.test(handle) &&
        !ignorePaths.has(handle.toLowerCase())
      ) {
        handlesSet.add(cleanHandle(handle));
      }
    };

    // 1. Try JSON parsing FIRST
    try {
      if (content.startsWith('{') || content.startsWith('[') || content.includes('string_list_data') || content.includes('relationships_')) {
        const json = JSON.parse(content);
        extractFromJson(json, addIfValid);
        if (handlesSet.size > 0) {
          return Array.from(handlesSet);
        }
      }
    } catch (e) {
      console.warn("JSON parse attempt:", e);
    }

    // 2. Try DOM Parsing if content contains HTML tags
    if (content.includes('<') && content.includes('>')) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');

        const anchors = doc.querySelectorAll('a');
        anchors.forEach(a => {
          const href = a.getAttribute('href') || '';
          const hrefMatch = href.match(/(?:instagram\.com|^)?\/(?:_u\/)?([a-zA-Z0-9_\.]+)/i);
          if (hrefMatch && hrefMatch[1]) {
            addIfValid(hrefMatch[1]);
          }
          if (a.textContent) {
            addIfValid(a.textContent);
          }
        });

        const textElements = doc.querySelectorAll('h2, h3, h4, p, span, td, th, div, li');
        textElements.forEach(el => {
          if (el.children.length === 0 && el.textContent) {
            addIfValid(el.textContent);
          }
        });

        if (handlesSet.size > 0) {
          return Array.from(handlesSet);
        }
      } catch (err) {
        console.warn("DOMParser error:", err);
      }
    }

    // 3. Fallback: Global Regex search across raw text for instagram.com URLs
    const globalUrlMatches = content.matchAll(/instagram\.com\/(?:_u\/)?([a-zA-Z0-9_\.]+)/gi);
    for (const match of globalUrlMatches) {
      if (match[1]) addIfValid(match[1]);
    }

    // 4. Fallback: Line-by-line plain text
    if (handlesSet.size === 0) {
      const lines = content.split(/[\r\n,;\s]+/);
      lines.forEach(line => {
        addIfValid(line);
      });
    }

    return Array.from(handlesSet);
  }

  function extractFromJson(data, addIfValid) {
    if (!data) return;
    if (Array.isArray(data)) {
      data.forEach(item => extractFromJson(item, addIfValid));
    } else if (typeof data === 'object') {
      if (data.string_list_data && Array.isArray(data.string_list_data)) {
        data.string_list_data.forEach(sub => {
          if (sub.value) addIfValid(sub.value);
          if (sub.href) addIfValid(sub.href);
        });
      }
      if (data.title && typeof data.title === 'string') addIfValid(data.title);
      if (data.value && typeof data.value === 'string') addIfValid(data.value);
      if (data.username && typeof data.username === 'string') addIfValid(data.username);
      if (data.name && typeof data.name === 'string') addIfValid(data.name);

      for (const key in data) {
        if (typeof data[key] === 'object') {
          extractFromJson(data[key], addIfValid);
        }
      }
    }
  }

  function cleanHandle(handle) {
    let result = handle.trim();
    if (optStripAt.checked && result.startsWith('@')) {
      result = result.substring(1);
    }
    if (optTrimSpace.checked) {
      result = result.trim();
    }
    return result;
  }

  // Core Comparison Logic
  function runComparison() {
    const rawFollowers = parseHandles(followersTextarea.value);
    const rawFollowing = parseHandles(followingTextarea.value);

    if (!rawFollowers.length && !rawFollowing.length) {
      showToast('Please upload or paste followers/following data first!', 'warning');
      return;
    }

    const isCaseInsensitive = optCaseInsensitive.checked;

    // Standardized maps for case handling
    const followersMap = new Map(); // normalizedKey -> originalHandle
    rawFollowers.forEach(h => {
      const key = isCaseInsensitive ? h.toLowerCase() : h;
      if (!followersMap.has(key)) followersMap.set(key, h);
    });

    const followingMap = new Map();
    rawFollowing.forEach(h => {
      const key = isCaseInsensitive ? h.toLowerCase() : h;
      if (!followingMap.has(key)) followingMap.set(key, h);
    });

    // 1. Non-followers: Accounts in Following, NOT in Followers (The Odd Ones)
    const nonFollowers = [];
    followingMap.forEach((originalHandle, key) => {
      if (!followersMap.has(key)) {
        nonFollowers.push(originalHandle);
      }
    });

    // 2. Fans: Accounts in Followers, NOT in Following
    const fans = [];
    followersMap.forEach((originalHandle, key) => {
      if (!followingMap.has(key)) {
        fans.push(originalHandle);
      }
    });

    // 3. Mutuals: Accounts in BOTH
    const mutuals = [];
    followingMap.forEach((originalHandle, key) => {
      if (followersMap.has(key)) {
        mutuals.push(originalHandle);
      }
    });

    // 4. All Unique
    const allSet = new Map([...followersMap, ...followingMap]);
    const allUnique = Array.from(allSet.values());

    const isReverse = optReverseOrder.checked;
    if (isReverse) {
      nonFollowers.reverse();
      fans.reverse();
      mutuals.reverse();
      allUnique.reverse();
    }

    // Save raw inputs to localStorage so user data persists across browser refresh
    saveRawInputs();

    // Update State
    analysisState.followers = rawFollowers;
    analysisState.following = rawFollowing;
    analysisState.nonFollowers = nonFollowers;
    analysisState.fans = fans;
    analysisState.mutuals = mutuals;
    analysisState.allUnique = allUnique;

    // Update UI Stats
    statNonFollowers.textContent = nonFollowers.length;
    statFans.textContent = fans.length;
    statMutuals.textContent = mutuals.length;

    countTabNonFollowers.textContent = nonFollowers.length;
    countTabFans.textContent = fans.length;
    countTabMutuals.textContent = mutuals.length;
    countTabAll.textContent = allUnique.length;

    resultsSection.classList.add('active');
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    renderCopyBox();
    showToast(`Comparison complete! Found ${nonFollowers.length} non-followers.`);
  }

  // Unfollow Tracker & Session LocalStorage Persistence Keys
  const STORAGE_KEY_DONE = 'comarator_unfollowed_handles';
  const STORAGE_KEY_HOURLY = 'comarator_hourly_count';
  const STORAGE_KEY_RAW_FOLLOWERS = 'comarator_raw_followers';
  const STORAGE_KEY_RAW_FOLLOWING = 'comarator_raw_following';
  const STORAGE_KEY_AUTO_DELAY = 'comarator_auto_delay';
  const STORAGE_KEY_AUTO_VAR = 'comarator_auto_var';

  const btnOpenNext = document.getElementById('btnOpenNext');
  const btnResetTracker = document.getElementById('btnResetTracker');
  const trackerProgressText = document.getElementById('trackerProgressText');
  const progressSlider = document.getElementById('progressSlider');
  const inputJumpTo = document.getElementById('inputJumpTo');
  const hourlyCountEl = document.getElementById('hourlyCount');
  const safetyBadge = document.getElementById('safetyBadge');

  // Auto Next Elements
  const btnAutoNext = document.getElementById('btnAutoNext');
  const autoNextDelay = document.getElementById('autoNextDelay');
  const chkVariableDelay = document.getElementById('chkVariableDelay');
  const autoNextCountdown = document.getElementById('autoNextCountdown');
  const countdownSecs = document.getElementById('countdownSecs');

  let unfollowedHandles = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY_DONE) || '[]'));
  let hourlyData = JSON.parse(localStorage.getItem(STORAGE_KEY_HOURLY) || '{"count":0,"timestamp":0}');

  // Auto Next State
  let isAutoNextRunning = false;
  let autoNextTimeout = null;
  let autoNextInterval = null;
  let countdownSecsRemaining = 0;

  // Restore saved Auto Next preferences
  const savedDelay = localStorage.getItem(STORAGE_KEY_AUTO_DELAY);
  if (savedDelay && autoNextDelay) {
    autoNextDelay.value = Math.max(3, parseInt(savedDelay) || 5);
  }
  const savedVar = localStorage.getItem(STORAGE_KEY_AUTO_VAR);
  if (savedVar !== null && chkVariableDelay) {
    chkVariableDelay.checked = savedVar === 'true';
  }

  // Enforce minimum 3s constraint
  if (autoNextDelay) {
    autoNextDelay.addEventListener('change', () => {
      let val = parseInt(autoNextDelay.value) || 5;
      if (val < 3) {
        val = 3;
        showToast('Minimum auto-next interval is 3 seconds for safe rate limits.', 'warning');
      }
      autoNextDelay.value = val;
      localStorage.setItem(STORAGE_KEY_AUTO_DELAY, val);
    });
  }

  if (chkVariableDelay) {
    chkVariableDelay.addEventListener('change', () => {
      localStorage.setItem(STORAGE_KEY_AUTO_VAR, chkVariableDelay.checked);
    });
  }

  // Save Raw Inputs for Auto-Restore on Refresh
  function saveRawInputs() {
    localStorage.setItem(STORAGE_KEY_RAW_FOLLOWERS, followersTextarea.value);
    localStorage.setItem(STORAGE_KEY_RAW_FOLLOWING, followingTextarea.value);
  }

  // Restore Raw Inputs on Page Load
  function restoreRawInputs() {
    const savedFollowers = localStorage.getItem(STORAGE_KEY_RAW_FOLLOWERS);
    const savedFollowing = localStorage.getItem(STORAGE_KEY_RAW_FOLLOWING);

    if (savedFollowers || savedFollowing) {
      if (savedFollowers) followersTextarea.value = savedFollowers;
      if (savedFollowing) followingTextarea.value = savedFollowing;
      updateCounts();
      runComparison();
      showToast('Restored previous session data!');
    }
  }

  // Reset hourly counter if more than 1 hour (3600000 ms) has passed
  function getHourlyCount() {
    const now = Date.now();
    if (now - hourlyData.timestamp > 3600000) {
      hourlyData = { count: 0, timestamp: now };
      localStorage.setItem(STORAGE_KEY_HOURLY, JSON.stringify(hourlyData));
    }
    return hourlyData.count;
  }

  function incrementHourlyCount() {
    const now = Date.now();
    if (now - hourlyData.timestamp > 3600000) {
      hourlyData = { count: 1, timestamp: now };
    } else {
      hourlyData.count += 1;
    }
    localStorage.setItem(STORAGE_KEY_HOURLY, JSON.stringify(hourlyData));
    return hourlyData.count;
  }

  function toggleUnfollowed(handle, forceStatus = null) {
    const cleanKey = handle.toLowerCase().replace(/^@/, '');
    const isDone = forceStatus !== null ? forceStatus : !unfollowedHandles.has(cleanKey);

    if (isDone) {
      unfollowedHandles.add(cleanKey);
      incrementHourlyCount();
    } else {
      unfollowedHandles.delete(cleanKey);
    }

    localStorage.setItem(STORAGE_KEY_DONE, JSON.stringify(Array.from(unfollowedHandles)));
    renderCopyBox();
  }

  // Set Done Up To specific number (from Slider or Jump Number Input)
  function setDoneUpTo(targetNumber) {
    const list = analysisState.currentDisplayList;
    if (!list || !list.length) return;

    const limit = Math.max(0, Math.min(targetNumber, list.length));
    let newlyMarked = 0;

    for (let i = 0; i < list.length; i++) {
      const cleanKey = list[i].toLowerCase().replace(/^@/, '');
      if (i < limit) {
        if (!unfollowedHandles.has(cleanKey)) {
          newlyMarked++;
        }
        unfollowedHandles.add(cleanKey);
      } else {
        unfollowedHandles.delete(cleanKey);
      }
    }

    if (newlyMarked > 0) {
      for (let k = 0; k < newlyMarked; k++) {
        incrementHourlyCount();
      }
    }

    localStorage.setItem(STORAGE_KEY_DONE, JSON.stringify(Array.from(unfollowedHandles)));
    renderCopyBox();

    // Scroll Copy Box smoothly to the active item
    if (limit < list.length) {
      const targetHandle = list[limit].replace(/^@/, '');
      const rowEl = document.getElementById(`row-${targetHandle}`);
      if (rowEl) {
        rowEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    showToast(`Updated progress: marked up to #${limit} as Done.`);
  }

  // Interactive Slider & Number Input Listeners
  progressSlider.addEventListener('input', (e) => {
    const targetVal = parseInt(e.target.value) || 0;
    setDoneUpTo(targetVal);
  });

  inputJumpTo.addEventListener('change', (e) => {
    const targetVal = parseInt(e.target.value) || 0;
    setDoneUpTo(targetVal);
  });

  // Open Next Single Profile Logic
  let autoTabRef = null;

  function openNextProfile(isAuto = false) {
    const list = analysisState.currentDisplayList;
    if (!list || !list.length) {
      if (!isAuto) showToast('No accounts in the current list.', 'warning');
      return false;
    }

    // Find first remaining handle not marked as done
    let nextHandle = list.find(h => !unfollowedHandles.has(h.toLowerCase().replace(/^@/, '')));

    // In Auto mode, loop back from top if all items in current list are completed
    if (!nextHandle && isAuto) {
      nextHandle = list[0];
      showToast('🔄 Reached end of list! Looping back from top in auto mode...');
    }

    if (!nextHandle) {
      showToast('🎉 All accounts in this list have been marked as unfollowed!');
      if (isAutoNextRunning) {
        stopAutoNext('All accounts in list completed!');
      }
      return false;
    }

    const cleanH = nextHandle.replace(/^@/, '');
    const profileUrl = `https://www.instagram.com/${cleanH}/`;

    if (isAuto) {
      // Re-use dedicated tab window to bypass browser pop-up blocker completely
      try {
        if (autoTabRef && !autoTabRef.closed) {
          autoTabRef.location.href = profileUrl;
          autoTabRef.focus();
        } else {
          autoTabRef = window.open(profileUrl, 'InstagramAutoTab');
        }
      } catch (e) {
        autoTabRef = window.open(profileUrl, 'InstagramAutoTab');
      }

      if (!autoTabRef || autoTabRef.closed || typeof autoTabRef.closed === 'undefined') {
        showToast('⚠️ Pop-up blocked! Please click "Allow Pop-ups" in your browser address bar.', 'warning');
      }
    } else {
      // Manual click opens in a new tab
      const win = window.open(profileUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        showToast('⚠️ Pop-up blocked! Please click "Allow Pop-ups" in your browser address bar.', 'warning');
      }
    }

    toggleUnfollowed(cleanH, true);
    showToast(`Opened @${cleanH} on Instagram & marked done`);
    return true;
  }

  btnOpenNext.addEventListener('click', () => {
    openNextProfile(false);
  });

  // Auto Next Control Handlers
  if (btnAutoNext) {
    btnAutoNext.addEventListener('click', () => {
      if (isAutoNextRunning) {
        stopAutoNext('Auto Next stopped by user');
      } else {
        startAutoNext();
      }
    });
  }

  function startAutoNext() {
    const list = analysisState.currentDisplayList;
    if (!list || !list.length) {
      showToast('No accounts in the current list.', 'warning');
      return;
    }

    isAutoNextRunning = true;
    if (btnAutoNext) {
      btnAutoNext.classList.add('is-running');
      btnAutoNext.innerHTML = `<i class="fa-solid fa-square"></i> Stop Auto`;
    }
    if (autoNextCountdown) {
      autoNextCountdown.style.display = 'inline-flex';
    }

    showToast('🚀 Auto Next started! Running continuously in loop until you click Stop.');

    // Trigger FIRST profile opening synchronously inside this click gesture to ensure popup approval!
    const success = openNextProfile(true);
    if (success && isAutoNextRunning) {
      scheduleNextAutoRun();
    }
  }

  function scheduleNextAutoRun() {
    if (!isAutoNextRunning) return;

    clearTimeout(autoNextTimeout);
    clearInterval(autoNextInterval);

    let baseDelay = parseInt(autoNextDelay.value) || 5;
    if (baseDelay < 3) {
      baseDelay = 3;
      autoNextDelay.value = 3;
    }

    let actualDelay = baseDelay;
    if (chkVariableDelay && chkVariableDelay.checked) {
      // Add random variable delay (+0 to +3s extra) for natural human-like timing
      const randomJitter = Math.floor(Math.random() * 3);
      actualDelay = baseDelay + randomJitter;
    }

    countdownSecsRemaining = actualDelay;
    if (countdownSecs) countdownSecs.textContent = countdownSecsRemaining;

    autoNextInterval = setInterval(() => {
      countdownSecsRemaining--;
      if (countdownSecsRemaining >= 0 && countdownSecs) {
        countdownSecs.textContent = countdownSecsRemaining;
      }
    }, 1000);

    autoNextTimeout = setTimeout(() => {
      clearInterval(autoNextInterval);
      if (!isAutoNextRunning) return;

      openNextProfile(true);
      if (isAutoNextRunning) {
        scheduleNextAutoRun();
      }
    }, actualDelay * 1000);
  }

  function stopAutoNext(reasonMsg = null) {
    isAutoNextRunning = false;
    clearTimeout(autoNextTimeout);
    clearInterval(autoNextInterval);

    if (btnAutoNext) {
      btnAutoNext.classList.remove('is-running');
      btnAutoNext.innerHTML = `<i class="fa-solid fa-play"></i> Start Auto`;
    }
    if (autoNextCountdown) {
      autoNextCountdown.style.display = 'none';
    }
    if (reasonMsg) {
      showToast(reasonMsg);
    }
  }

  btnResetTracker.addEventListener('click', () => {
    if (confirm('Clear all unfollow tracking progress?')) {
      if (isAutoNextRunning) stopAutoNext();
      unfollowedHandles.clear();
      localStorage.removeItem(STORAGE_KEY_DONE);
      renderCopyBox();
      showToast('Unfollow tracking progress cleared.');
    }
  });

  // Render Line-by-Line Copy Box
  fu`nction renderCopyBox() {
    let list = [];
    let titleText = '';

    switch (analysisState.activeTab) {
      case 'non-followers':
        list = analysisState.nonFollowers;
        titleText = `Don't Follow Back (${list.length} Odd Accounts)`;
  break;
      case 'fans':
  list = analysisState.fans;
  titleText = `Your Fans (${list.length} Accounts)`;
  break;
      case 'mutuals':
  list = analysisState.mutuals;
  titleText = `Mutual Followers (${list.length} Accounts)`;
  break;
      case 'all':
  list = analysisState.allUnique;
  titleText = `All Accounts (${list.length} Total)`;
  break;
}

    // Apply Search Filter
    const query = searchInput.value.trim().toLowerCase();
if (query) {
  list = list.filter(handle => handle.toLowerCase().includes(query));
}

analysisState.currentDisplayList = list;
copyBoxTitle.textContent = titleText;

// Calculate Progress Bar & Hourly Stats
let doneCount = 0;
list.forEach(h => {
  if (unfollowedHandles.has(h.toLowerCase().replace(/^@/, ''))) {
    doneCount++;
  }
});

const totalCount = list.length;
const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

trackerProgressText.textContent = `Progress: ${doneCount} / ${totalCount} Done (${percent}%)`;

// Sync progress bar gradient fill width
const progressBarFill = document.getElementById('progressBarFill');
if (progressBarFill) {
  progressBarFill.style.width = `${percent}%`;
}

// Sync interactive slider and jump input
progressSlider.max = totalCount;
progressSlider.value = doneCount;
inputJumpTo.max = totalCount;
inputJumpTo.value = doneCount;

const currentHourly = getHourlyCount();
hourlyCountEl.textContent = currentHourly;

if (currentHourly >= 15) {
  safetyBadge.style.background = 'rgba(239, 68, 68, 0.2)';
  safetyBadge.style.color = 'var(--accent-red)';
  safetyBadge.style.borderColor = 'rgba(239, 68, 68, 0.4)';
} else {
  safetyBadge.style.background = 'rgba(16, 185, 129, 0.15)';
  safetyBadge.style.color = 'var(--accent-green)';
  safetyBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
}

if (list.length === 0) {
  copyBoxBody.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-user-check"></i>
          <p>No accounts found in this category${query ? ' matching "' + query + '"' : ''}.</p>
        </div>
      `;
  return;
}

// Render line-by-line items with Tracker actions
let html = '';
list.forEach((handle, index) => {
  const cleanH = handle.startsWith('@') ? handle.substring(1) : handle;
  const displayHandle = `@${cleanH}`;
  const profileUrl = `https://www.instagram.com/${cleanH}/`;
  const isDone = unfollowedHandles.has(cleanH.toLowerCase());

  html += `
        <div class="copy-item-row ${isDone ? 'done' : ''}" id="row-${cleanH}">
          <div class="item-left">
            <span class="line-num">#${index + 1}</span>
            <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="user-handle-link" title="Open ${displayHandle} on Instagram">
              ${displayHandle} <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
          <div class="item-actions">
            <button class="btn-mark-done ${isDone ? 'is-done' : ''}" data-handle="${cleanH}">
              <i class="fa-solid ${isDone ? 'fa-circle-check' : 'fa-circle'}"></i> ${isDone ? 'Unfollowed' : 'Mark Done'}
            </button>
            <button class="btn-copy-item" data-handle="${displayHandle}">
              <i class="fa-regular fa-copy"></i> Copy
            </button>
          </div>
        </div>
      `;
});

copyBoxBody.innerHTML = html;

// Attach Done Toggle Listeners
const doneBtns = copyBoxBody.querySelectorAll('.btn-mark-done');
doneBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    toggleUnfollowed(btn.dataset.handle);
  });
});

// Attach individual copy button listeners
const copyBtns = copyBoxBody.querySelectorAll('.btn-copy-item');
copyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const handleToCopy = btn.dataset.handle;
    copyToClipboard(handleToCopy);

    btn.classList.add('copied');
    btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;

    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy`;
    }, 1800);
  });
});
  }

// Copy All Lines
function copyAllLines() {
  if (!analysisState.currentDisplayList.length) {
    showToast('No usernames available to copy', 'warning');
    return;
  }

  const formattedList = analysisState.currentDisplayList
    .map(h => h.startsWith('@') ? h : `@${h}`)
    .join('\n');

  copyToClipboard(formattedList);
  showToast(`Copied ${analysisState.currentDisplayList.length} handles line-by-line to clipboard!`);
}

// Download Output as TXT
function downloadAsTxt() {
  if (!analysisState.currentDisplayList.length) {
    showToast('No usernames available to download', 'warning');
    return;
  }

  const textContent = analysisState.currentDisplayList
    .map(h => h.startsWith('@') ? h : `@${h}`)
    .join('\r\n');

  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `instagram_${analysisState.activeTab}_list.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Downloaded instagram_${analysisState.activeTab}_list.txt`);
}

// Utility Clipboard
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(err => {
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

// Toast Notification System
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'warning' ? 'fa-triangle-exclamation' : 'fa-check';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Load Demo Data
function loadDemoData() {
  followersTextarea.value = demoFollowersHTML.trim();
  followingTextarea.value = demoFollowingHTML.trim();
  followersFileLabel.textContent = 'demo_followers.html';
  followingFileLabel.textContent = 'demo_following.html';
  updateCounts();
  runComparison();
  showToast('Loaded demo Instagram HTML data!');
}

// Reset Application State
function resetAll() {
  if (typeof isAutoNextRunning !== 'undefined' && isAutoNextRunning) {
    stopAutoNext('Cleared all inputs');
  }

  followersTextarea.value = '';
  followingTextarea.value = '';
  followersFileLabel.textContent = 'HTML / Text';
  followingFileLabel.textContent = 'HTML / Text';
  followersCountEl.textContent = '0 accounts';
  followingCountEl.textContent = '0 accounts';

  localStorage.removeItem(STORAGE_KEY_RAW_FOLLOWERS);
  localStorage.removeItem(STORAGE_KEY_RAW_FOLLOWING);

  resultsSection.classList.remove('active');
  analysisState = {
    followers: [],
    following: [],
    nonFollowers: [],
    fans: [],
    mutuals: [],
    allUnique: [],
    activeTab: 'non-followers',
    currentDisplayList: []
  };

  showToast('Cleared all inputs');
}

// Restore previous session on page load if available
restoreRawInputs()
});
