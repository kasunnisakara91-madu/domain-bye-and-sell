package com.example.data.repository

import com.example.data.models.AdminStats
import com.example.data.models.ApiItem
import com.example.data.models.BankDetails
import com.example.data.models.BotItem
import com.example.data.models.DomainItem
import com.example.data.models.OrderItem
import com.example.data.models.UnlockedItem
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.UUID
import kotlin.random.Random

class DomainSellRepository {

    // Current Customer
    private val _currentUsername = MutableStateFlow("kasun_dev")
    val currentUsername: StateFlow<String> = _currentUsername.asStateFlow()

    // Domains
    private val _domains = MutableStateFlow<List<DomainItem>>(listOf(
        DomainItem("d-1", "cloudpay.com", ".com", ".com", 14500.0, 19000.0, "High-brandable fintech & payments domain with international trust.", "available", true, true),
        DomainItem("d-2", "sltech.lk", ".lk", ".lk", 4200.0, 5500.0, "Top Sri Lankan technology and startup brand domain name.", "available", true, true),
        DomainItem("d-3", "neuronet.net", ".net", ".net", 3400.0, 4200.0, "Cybernetics, telecom & network infrastructure brand.", "available", true),
        DomainItem("d-4", "ceyloncare.org", ".org", ".org", 3600.0, 4500.0, "Foundation, charity and community organization domain.", "available", true),
        DomainItem("d-5", "cyberstudio.site", ".site", ".site", 1450.0, 2200.0, "Creative digital agency and web development showcase.", "available", true),
        DomainItem("d-6", "lankashop.online", ".online", ".online", 1650.0, 2400.0, "Modern 24/7 e-commerce store domain for retail businesses.", "available", true),
        DomainItem("d-7", "web3meta.xyz", ".xyz", ".xyz", 1250.0, 1950.0, "Decentralized protocol and future tech brand identifier.", "available", true, true),
        DomainItem("d-8", "ai.lk", "custom", "Custom Domains", 28000.0, 45000.0, "Ultra-rare two-letter national AI domain with instant manual transfer.", "available", true, true)
    ))
    val domains: StateFlow<List<DomainItem>> = _domains.asStateFlow()

    // APIs
    private val _apis = MutableStateFlow<List<ApiItem>>(listOf(
        ApiItem("api-1", "WhatsApp Cloud Gateway API", "WhatsApp APIs", 6500.0, 8500.0, "Official Meta cloud API bridge with webhook dispatcher, template triggers & zero ban risk.", listOf("Official Meta Bridge", "Webhook Dispatcher", "Template Messaging", "Zero Ban Risk"), "/api/v1/whatsapp/send"),
        ApiItem("api-2", "Multimodal Neural AI API", "AI APIs", 5200.0, 7000.0, "Ultra low-latency text, voice and computer-vision intelligence backend with structured JSON output.", listOf("Multimodal Vision", "Sinhala & Tamil Support", "JSON Outputs", "High Speed"), "/api/v1/ai/generate"),
        ApiItem("api-3", "Global Cinema & Movie DB API", "Movie APIs", 3800.0, 4900.0, "Direct streaming link resolver, high-res posters, subtitles, and IMDb/Rotten metadata.", listOf("1080p Stream Links", "Sinhala Subtitles", "IMDb Metas", "Auto Update"), "/api/v1/movie/search"),
        ApiItem("api-4", "High-Fidelity Music Indexer API", "Music APIs", 3200.0, 4500.0, "Lossless audio metadata, synchronized lyrics provider, and multi-platform ID converter.", listOf("LRC Synced Lyrics", "Apple/Spotify IDs", "Lossless Covers"), "/api/v1/music/resolve"),
        ApiItem("api-5", "Unified Social Media Scraper API", "Social Media APIs", 4900.0, 6200.0, "Extract trending hashtags, video metrics, follower analytics from Instagram, TikTok & YouTube.", listOf("TikTok Trends", "Insta Scraper", "YouTube Metrics"), "/api/v1/social/trends"),
        ApiItem("api-6", "Generative Image Studio API", "Image APIs", 4200.0, 5800.0, "Real-time background removal, upscaling, neural face enhancement, and photorealistic generation.", listOf("BG Remover", "4x Upscaling", "Face Restore"), "/api/v1/image/process"),
        ApiItem("api-7", "HLS Video Transcoder & CDN API", "Video APIs", 5800.0, 7900.0, "Convert MP4 to multi-bitrate HLS (.m3u8), auto-generate thumbnails, and stream at blazing speeds.", listOf("HLS Conversion", "CDN Edge Caching", "Signed Tokens"), "/api/v1/video/hls"),
        ApiItem("api-8", "Custom Enterprise Webhook Gateway", "Custom APIs", 7500.0, 9900.0, "Tailor-made private API endpoint built to your exact payload specs with SLA support.", listOf("Custom Schema", "Webhook Retries", "Private IP"), "/api/v1/custom/webhook")
    ))
    val apis: StateFlow<List<ApiItem>> = _apis.asStateFlow()

    // Bots
    private val _bots = MutableStateFlow<List<BotItem>>(listOf(
        BotItem("bot-1", "WhatsApp E-Commerce Store Bot", "WhatsApp Bots", 8500.0, 12000.0, "Turn your WhatsApp into a 24/7 revenue powerhouse. Handles product browsing, ordering, and receipt collection automatically.", listOf("Interactive product catalog", "Cart & checkout calculator", "Bank receipt submission link", "Order tracking by ID", "Admin instant dispatch alert"), "1. Connect Meta Cloud Phone ID\n2. Set up Webhook in Meta developer app\n3. Upload CSV catalog."),
        BotItem("bot-2", "AI Smart Customer Support Bot", "WhatsApp Bots", 7200.0, 9800.0, "Delight clients with hyper-intelligent instant answers in Sinhala, Tamil, or English with seamless human escalation.", listOf("Understands Sinhala/Tamil/English", "Trained on business FAQ", "Human handover trigger", "24/7 zero delay reply"), "1. Upload PDF/FAQ knowledge base\n2. Set escalation number\n3. Deploy bot."),
        BotItem("bot-3", "Salon, Clinic & Service Booking Bot", "WhatsApp Bots", 6800.0, 9000.0, "Completely eliminates scheduling phone calls. Book clients directly inside their WhatsApp chat with automated reminders.", listOf("Calendar slot checking", "Google Calendar sync", "2hr prior reminder", "Advance deposit verification"), "1. Link Google Calendar\n2. Configure working hours\n3. Set advance deposit amount."),
        BotItem("bot-4", "Tuition Class & Student Portal Bot", "WhatsApp Bots", 6400.0, 8500.0, "Specially architected for Sri Lankan tuition masters and institutes. Automates class fee verification and lecture link distribution.", listOf("Student registration by index", "Monthly fee bank slip upload", "Auto Zoom link dispatch", "Exam timetable lookup"), "1. Upload student roster\n2. Set monthly fee cutoff\n3. Admin verifies slip to release Zoom link."),
        BotItem("bot-5", "Real Estate & Auto Dealer Lead Bot", "WhatsApp Bots", 7800.0, 10500.0, "Capture high-intent leads from Facebook and Instagram ads directly into WhatsApp and qualify their budget automatically.", listOf("Interactive questionnaire", "Budget & location filtering", "Instant PDF brochure", "Sales rep WhatsApp alert"), "1. Link to Meta Ad account\n2. Setup lead questions\n3. Assign sales reps.")
    ))
    val bots: StateFlow<List<BotItem>> = _bots.asStateFlow()

    // Orders
    private val _orders = MutableStateFlow<List<OrderItem>>(listOf(
        OrderItem("DS-94821", "kasun_dev", "domain", "sltech.lk", "sltech.lk", 4200.0, "unlocked", System.currentTimeMillis() - 86400000, "+94771234567", "slip-01.jpg", "Verified & Unlocked"),
        OrderItem("DS-83910", "kasun_dev", "api", "WhatsApp Cloud Gateway API", "", 6500.0, "payment_submitted", System.currentTimeMillis() - 3600000, "+94771234567", "slip-02.png", "In Admin Review"),
        OrderItem("DS-71204", "demo_user", "domain", "cloudpay.com", "cloudpay.com", 14500.0, "pending", System.currentTimeMillis() - 7200000, "", "", "Awaiting Bank Slip")
    ))
    val orders: StateFlow<List<OrderItem>> = _orders.asStateFlow()

    // Unlocked Products
    private val _unlockedItems = MutableStateFlow<List<UnlockedItem>>(listOf(
        UnlockedItem("u-1", "domain", "sltech.lk", "sltech.lk", "DS-94821", System.currentTimeMillis() - 86400000, "Active Nameservers: ns1.domainsell.lk, ns2.domainsell.lk\nDNS Propagation: Active\nRegistered to: kasun_dev")
    ))
    val unlockedItems: StateFlow<List<UnlockedItem>> = _unlockedItems.asStateFlow()

    // Bank Details
    private val _bankDetails = MutableStateFlow(BankDetails())
    val bankDetails: StateFlow<BankDetails> = _bankDetails.asStateFlow()

    // Admin WhatsApp
    val adminWhatsApp = "94771234567"

    fun setUsername(newUsername: String) {
        val clean = newUsername.trim().lowercase()
        if (clean.isNotEmpty()) {
            _currentUsername.value = clean
        }
    }

    // Place an Order
    fun placeOrder(
        productType: String,
        productName: String,
        domainName: String,
        amount: Double,
        username: String = _currentUsername.value
    ): OrderItem {
        val orderId = "DS-${Random.nextInt(10000, 99999)}"
        val newOrder = OrderItem(
            orderId = orderId,
            username = username.lowercase(),
            productType = productType,
            productName = productName,
            domainName = domainName,
            amount = amount,
            status = "pending",
            createdAt = System.currentTimeMillis()
        )

        _orders.value = listOf(newOrder) + _orders.value

        // If domain, set status reserved
        if (productType == "domain" && domainName.isNotEmpty()) {
            _domains.value = _domains.value.map {
                if (it.name.equals(domainName, ignoreCase = true)) it.copy(status = "reserved") else it
            }
        }

        return newOrder
    }

    // Submit Bank Transfer Receipt
    fun submitReceipt(orderId: String, whatsapp: String, slipName: String = "bank_receipt.jpg") {
        _orders.value = _orders.value.map { order ->
            if (order.orderId == orderId) {
                order.copy(
                    status = "payment_submitted",
                    whatsappContact = whatsapp,
                    receiptFilename = slipName
                )
            } else order
        }
    }

    // Admin: Approve / Reject Payment
    fun verifyPayment(orderId: String, approve: Boolean, notes: String = "") {
        _orders.value = _orders.value.map { order ->
            if (order.orderId == orderId) {
                order.copy(
                    status = if (approve) "verified" else "rejected",
                    adminNotes = if (notes.isNotEmpty()) notes else if (approve) "Payment verified by administrator." else "Payment slip rejected."
                )
            } else order
        }
    }

    // Admin: Unlock Product for Exact Customer Username (STEP 9)
    fun unlockProduct(orderId: String): Boolean {
        val targetOrder = _orders.value.find { it.orderId == orderId } ?: return false

        // Update order status
        _orders.value = _orders.value.map {
            if (it.orderId == orderId) it.copy(status = "unlocked", adminNotes = "Officially unlocked & transferred.") else it
        }

        // Generate delivery credentials
        val creds = when (targetOrder.productType) {
            "domain" -> "Nameservers: ns1.domainsell.lk, ns2.domainsell.lk\nDNS Status: Propagated\nAssigned To: ${targetOrder.username}"
            "api" -> "Secret Live Key: ds_live_${UUID.randomUUID().toString().replace("-", "")}\nEndpoint: https://api.domainsell.net/v1\nQuota: Unlimited"
            else -> "Bot Webhook Token: bot_tok_${UUID.randomUUID().toString().substring(0, 16)}\nMeta Cloud URL: https://bot.domainsell.net/webhook/${targetOrder.orderId}"
        }

        val unlocked = UnlockedItem(
            id = UUID.randomUUID().toString(),
            itemType = targetOrder.productType,
            itemName = targetOrder.productName,
            domainName = targetOrder.domainName,
            orderId = targetOrder.orderId,
            unlockedAt = System.currentTimeMillis(),
            credentials = creds
        )

        _unlockedItems.value = listOf(unlocked) + _unlockedItems.value

        // If domain, mark as SOLD
        if (targetOrder.domainName.isNotEmpty()) {
            _domains.value = _domains.value.map {
                if (it.name.equals(targetOrder.domainName, ignoreCase = true)) it.copy(status = "sold") else it
            }
        }

        return true
    }

    // Admin: Add Domain
    fun addDomain(name: String, tld: String, price: Double, desc: String) {
        val item = DomainItem(
            id = UUID.randomUUID().toString(),
            name = name.lowercase().trim(),
            tld = tld,
            category = tld,
            price = price,
            originalPrice = price * 1.25,
            description = desc,
            status = "available"
        )
        _domains.value = listOf(item) + _domains.value
    }

    // Admin: Update Bank Details
    fun updateBankDetails(bankName: String, holder: String, accNum: String, branch: String) {
        _bankDetails.value = BankDetails(bankName, holder, accNum, branch)
    }

    // Compute admin stats
    fun getAdminStats(): AdminStats {
        val list = _orders.value
        val revenue = list.filter { it.status in listOf("verified", "unlocked") }.sumOf { it.amount }
        val pending = list.count { it.status in listOf("pending", "payment_submitted") }
        val verified = list.count { it.status == "verified" }
        val unlocked = list.count { it.status == "unlocked" }
        return AdminStats(revenue, pending, verified, unlocked, list.size)
    }
}
