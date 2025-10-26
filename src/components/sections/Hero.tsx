import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroProps {
  onNavigate: (section: string) => void;
}

const Hero = ({ onNavigate }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-background" />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary tracking-wider uppercase">
              ANARCHIST
            </h1>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-accent tracking-wider uppercase">
              EMPIRE
            </h2>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Сервер без правил и границ. Создавай свою империю в мире абсолютной анархии
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-6 py-3 rounded-lg border border-primary/30">
              <Icon name="Server" className="text-primary" size={24} />
              <span className="text-xl font-mono text-foreground">play.anarchist-empire.ru</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              onClick={() => onNavigate('features')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8"
            >
              <Icon name="Zap" className="mr-2" size={20} />
              Преимущества
            </Button>
            <Button
              onClick={() => onNavigate('privileges')}
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 font-bold text-lg px-8"
            >
              <Icon name="Crown" className="mr-2" size={20} />
              Привилегии
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
              <div className="flex items-center justify-center mb-3">
                <Icon name="Users" className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">500+</h3>
              <p className="text-muted-foreground">Активных игроков</p>
            </div>
            <div className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
              <div className="flex items-center justify-center mb-3">
                <Icon name="Globe" className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">24/7</h3>
              <p className="text-muted-foreground">Онлайн без лагов</p>
            </div>
            <div className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
              <div className="flex items-center justify-center mb-3">
                <Icon name="Shield" className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">0</h3>
              <p className="text-muted-foreground">Правил и ограничений</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
