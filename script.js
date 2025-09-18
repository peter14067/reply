 // AI Chatbot Platform - JavaScript Functions

// Toggle chatbot visibility
function toggleChatbot() {
    const widget = document.getElementById('chatbotWidget');
    const container = document.getElementById('chatbotContainer');
    
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
        widget.classList.add('active');
    } else {
        container.style.display = 'none';
        widget.classList.remove('active');
    }
}

// Open chatbot (for CTA buttons)
function openChatbot() {
    const widget = document.getElementById('chatbotWidget');
    const container = document.getElementById('chatbotContainer');
    
    container.style.display = 'block';
    widget.classList.add('active');
    
    // Focus on input field
    setTimeout(() => {
        const input = document.getElementById('userInput');
        if (input) {
            input.focus();
        }
    }, 300);
}

// Scroll to specific section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle key press in input field
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Send message function
function sendMessage() {
    const input = document.getElementById('userInput');
    const messagesContainer = document.getElementById('chatbotMessages');
    
    if (!input || !messagesContainer) return;
    
    const message = input.value.trim();
    if (message === '') return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const botResponse = getBotResponse(message);
        addMessage(botResponse, 'bot');
    }, 1000);
}

// Add message to chat
function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Get bot response based on user input
function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Simple keyword matching for responses
    if (message.includes('價格') || message.includes('費用') || message.includes('多少錢')) {
        return '我們提供三種方案：免費版($0/月)、專業版($29/月)、企業版($99/月)。您想了解哪個方案的詳細資訊呢？';
    }
    
    if (message.includes('功能') || message.includes('特色')) {
        return '我們的主要功能包括：FAQ自動回覆、24/7即時回覆、真人客服轉接、留言自動回覆等。您對哪個功能最感興趣？';
    }
    
    if (message.includes('試用') || message.includes('免費')) {
        return '您可以立即開始免費試用！點擊「立即試用」按鈕即可體驗我們的服務。';
    }
    
    if (message.includes('聯繫') || message.includes('客服') || message.includes('電話')) {
        return '您可以通過以下方式聯繫我們：\n📧 contact@aichatbot.com\n📞 +886-2-1234-5678';
    }
    
    if (message.includes('你好') || message.includes('hi') || message.includes('hello')) {
        return '您好！我是AI客服助手，很高興為您服務！有什麼可以幫助您的嗎？';
    }
    
    // Default response
    return '感謝您的詢問！如果您需要了解我們的服務、價格方案或想要試用，請告訴我具體想了解什麼，我會為您詳細介紹。';
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Initialize chatbot widget
    const widget = document.getElementById('chatbotWidget');
    if (widget) {
        const container = document.getElementById('chatbotContainer');
        if (container) {
            container.style.display = 'none';
        }
    }
});
