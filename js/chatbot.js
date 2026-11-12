/**
 * GlobalReach Web Presence & Growth Portal
 * Interactive Floating Chatbot Assistant
 * File: js/chatbot.js
 */

/* ==========================================================================
   EXTERNAL CHATBOT INTEGRATION PLACEHOLDER
   --------------------------------------------------------------------------
   To connect an external enterprise chatbot provider (such as Intercom,
   Crisp, Tawk.to, Zendesk, or LiveChat), insert your tracking snippet
   inside this block or set window.GLOBALREACH_EXTERNAL_CHATBOT_CONFIG.
   
   Example:
   window.GLOBALREACH_EXTERNAL_CHATBOT_CONFIG = {
     provider: "crisp",
     websiteId: "YOUR-WEBSITE-ID"
   };
   
   The local fallback chatbot below will automatically detect if an external
   provider takes over, or continue running locally without interruption.
   ========================================================================== */

const ChatbotAssistant = (() => {
  const BOT_NAME = 'ReachBot';

  // Keyword response dictionary
  const RESPONSES = {
    pricing: 'GlobalReach offers transparent pricing: hourly work is ₹800/hour. We also offer fixed bundles: Starter at ₹9,999, Growth at ₹24,999, and Global at ₹49,999.',
    bundle: 'Our bundles include: \n1) Starter (₹9,999) - Essential 3-page site for local shops.\n2) Growth (₹24,999 - Most Popular) - 6-page site with CMS & lead capture.\n3) Global (₹49,999) - Multilingual 12-page store with international SEO.',
    hourly: 'Our hourly development and consultation rate is ₹800/hour. Perfect for bespoke features, minor enhancements, or flexible iterative design work.',
    guarantee: 'Every website delivered includes our 3-Year Website Support Guarantee! It covers correction of implementation defects, minor content updates, and technical guidance. It excludes third-party outages, major redesigns, domain fees, and guaranteed sales/profit outcomes.',
    support: 'Our 3-year support provides ongoing guidance, security patch advisory, and defect fixing to ensure your digital presence remains sturdy and up-to-date.',
    consultation: 'You can book a free consultation directly through our website consultation form or by calling our onboarding team. A stronger online presence can help your business reach more potential customers and generate more enquiries.',
    contact: 'You can contact GlobalReach via email at hello@globalreach.example.com, call +91 98765 43210, or fill out the consultation form on this page.',
    website: 'We build responsive, fast websites tailored for small businesses, independent professionals, local shops, and creators to help you connect with global markets.',
    hello: 'Hello! I am ReachBot, your GlobalReach virtual assistant. How can I help your business grow online today? Feel free to ask about pricing, bundles, guarantee, or consultation!',
    help: 'I can answer questions regarding: \n• "pricing" (hourly & packages)\n• "bundle" (Starter, Growth, Global)\n• "hourly" (₹800/hr rate)\n• "guarantee" (3-year support)\n• "support" (maintenance details)\n• "consultation" (booking a session)\n• "contact" (how to reach us)\n• "website" (our design services)'
  };

  const DEFAULT_RESPONSE = "I'm not quite sure about that, but our team would love to help! Ask me about 'pricing', 'bundle', 'hourly', 'guarantee', 'support', or 'consultation', or submit our contact form for a custom quote.";

  let chatHistory = [];

  const getMatchedResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Check specific required keywords
    if (input.includes('bundle') || input.includes('package') || input.includes('starter') || input.includes('growth') || input.includes('global')) {
      return RESPONSES.bundle;
    }
    if (input.includes('hourly') || input.includes('per hour') || input.includes('800')) {
      return RESPONSES.hourly;
    }
    if (input.includes('price') || input.includes('pricing') || input.includes('cost') || input.includes('rate')) {
      return RESPONSES.pricing;
    }
    if (input.includes('guarantee') || input.includes('warranty') || input.includes('3 year') || input.includes('three year')) {
      return RESPONSES.guarantee;
    }
    if (input.includes('support') || input.includes('maintenance') || input.includes('defect') || input.includes('update')) {
      return RESPONSES.support;
    }
    if (input.includes('consult') || input.includes('consultation') || input.includes('meeting') || input.includes('book')) {
      return RESPONSES.consultation;
    }
    if (input.includes('contact') || input.includes('email') || input.includes('phone') || input.includes('call') || input.includes('reach')) {
      return RESPONSES.contact;
    }
    if (input.includes('website') || input.includes('service') || input.includes('portfolio') || input.includes('mobile')) {
      return RESPONSES.website;
    }
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return RESPONSES.hello;
    }
    if (input.includes('help')) {
      return RESPONSES.help;
    }

    return DEFAULT_RESPONSE;
  };

  /**
   * Safely append a message to chat window using textContent (no innerHTML)
   */
  const appendMessage = (sender, text, timestamp = new Date().toISOString()) => {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;

    const msgElement = document.createElement('div');
    msgElement.className = sender === 'user' ? 'user-msg' : 'bot-msg';
    
    // Support multi-line formatting safely
    const lines = text.split('\n');
    lines.forEach((line, idx) => {
      if (idx > 0) msgElement.appendChild(document.createElement('br'));
      const textNode = document.createTextNode(line);
      msgElement.appendChild(textNode);
    });

    messagesContainer.appendChild(msgElement);
    
    // Auto-scroll to bottom per requirements
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const saveHistory = () => {
    if (window.StorageService) {
      // Keep up to 50 recent messages
      const trimmed = chatHistory.slice(-50);
      window.StorageService.set(window.StorageService.KEYS.CHAT_HISTORY, trimmed);
    }
  };

  const loadHistory = () => {
    if (window.StorageService) {
      const saved = window.StorageService.get(window.StorageService.KEYS.CHAT_HISTORY, []);
      if (Array.isArray(saved) && saved.length > 0) {
        chatHistory = saved;
        chatHistory.forEach((item) => {
          appendMessage(item.sender, item.text, item.timestamp);
        });
        return;
      }
    }

    // Default welcome message if no history
    const welcome = "Welcome to GlobalReach! I am ReachBot. Ask me anything about our ₹800/hr work, fixed bundles, 3-year support guarantee, or consultation!";
    chatHistory.push({ sender: 'bot', text: welcome, timestamp: new Date().toISOString() });
    appendMessage('bot', welcome);
  };

  const sendMessage = (text) => {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();

    // 1. Append user message
    const now = new Date().toISOString();
    chatHistory.push({ sender: 'user', text: cleanText, timestamp: now });
    appendMessage('user', cleanText, now);
    saveHistory();

    // 2. Simulate bot typing latency
    setTimeout(() => {
      const botReply = getMatchedResponse(cleanText);
      const replyTime = new Date().toISOString();
      chatHistory.push({ sender: 'bot', text: botReply, timestamp: replyTime });
      appendMessage('bot', botReply, replyTime);
      saveHistory();
    }, 400);
  };

  const init = () => {
    const fab = document.getElementById('chatbotFab');
    const chatWindow = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('chatbotCloseBtn');
    const chatForm = document.getElementById('chatbotForm');
    const chatInput = document.getElementById('chatbotInput');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    const clearHistoryBtn = document.getElementById('chatbotClearBtn');

    if (!fab || !chatWindow) return;

    loadHistory();

    // Toggle Chat Window
    fab.addEventListener('click', () => {
      const isOpen = chatWindow.classList.contains('open');
      if (isOpen) {
        chatWindow.classList.remove('open');
        fab.setAttribute('aria-expanded', 'false');
      } else {
        chatWindow.classList.add('open');
        fab.setAttribute('aria-expanded', 'true');
        if (chatInput) chatInput.focus();
        const messages = document.getElementById('chatbotMessages');
        if (messages) messages.scrollTop = messages.scrollHeight;
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
        fab.setAttribute('aria-expanded', 'false');
        fab.focus();
      });
    }

    // ESC key closes chat
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatWindow.classList.contains('open')) {
        chatWindow.classList.remove('open');
        fab.setAttribute('aria-expanded', 'false');
        fab.focus();
      }
    });

    // Chat submit
    if (chatForm && chatInput) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = chatInput.value;
        if (val.trim()) {
          sendMessage(val);
          chatInput.value = '';
        }
      });
    }

    // Suggestion chips
    suggestionChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query') || chip.textContent;
        sendMessage(query);
      });
    });

    // Clear history
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        if (window.StorageService) {
          window.StorageService.remove(window.StorageService.KEYS.CHAT_HISTORY);
        }
        chatHistory = [];
        const msgContainer = document.getElementById('chatbotMessages');
        if (msgContainer) msgContainer.textContent = '';
        loadHistory();
      });
    }
  };

  return {
    init,
    sendMessage,
    getMatchedResponse
  };
})();

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ChatbotAssistant.init);
} else {
  ChatbotAssistant.init();
}

window.ChatbotAssistant = ChatbotAssistant;
