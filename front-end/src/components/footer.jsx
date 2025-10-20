import { Link } from 'wouter'
import { Trophy, Twitter, Facebook, Instagram, Youtube } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-black/20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">WORLDCUPBET</span>
            </div>
            <p className="text-white/60 mb-4 max-w-md">
              The ultimate cryptocurrency betting platform for World Cup 2026. 
              Experience secure, transparent, and AI-powered sports betting.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/games">
                  <span className="text-white/60 hover:text-white transition-colors cursor-pointer">
                    Games
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/predictions">
                  <span className="text-white/60 hover:text-white transition-colors cursor-pointer">
                    Predictions
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/analytics">
                  <span className="text-white/60 hover:text-white transition-colors cursor-pointer">
                    Analytics
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/wallet">
                  <span className="text-white/60 hover:text-white transition-colors cursor-pointer">
                    Wallet
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-white/40 text-sm">
            © 2024 World Cup Betting. All rights reserved. 
            This is a demo application for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer