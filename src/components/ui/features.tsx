
import { Monitor, Eye, Mic, Globe, Plug, Shield } from 'lucide-react'

export function Features() {
    return (
        <section id="features" className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">AI that works the way you work</h2>
                    <p className="text-muted-foreground">Browse bridges the gap between AI promises and AI performance. While the market offers fragmented solutions, Browse delivers the complete package: an intelligent overlay that understands your screen, follows your voice commands, and executes real tasks across your entire desktop environment.</p>
                </div>

                <div className="relative mx-auto grid max-w-2xl lg:max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Monitor className="size-4" />
                            <h3 className="text-sm font-medium">On-device Intelligence</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Your data stays private, responses stay instant. All processing happens locally on your machine.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Eye className="size-4" />
                            <h3 className="text-sm font-medium">Screen-aware Execution</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Sees what you see, acts where you need it. Real computer vision for real computer control.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Mic className="size-4" />
                            <h3 className="text-sm font-medium">Voice-driven Control</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Natural commands that translate to real actions. Speak your intent, watch it happen.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Globe className="size-4" />
                            <h3 className="text-sm font-medium">Universal Compatibility</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Works across any desktop app, no integrations required. One agent, every application.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Plug className="size-4" />
                            <h3 className="text-sm font-medium">Open Architecture</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Plugin-ready and fully customizable. Extend Browse to fit your exact workflow.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Shield className="size-4" />
                            <h3 className="text-sm font-medium">Always in Control</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Stoppable, transparent, and trustworthy. You're in command, always.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
