<?php

namespace App\Providers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->registerModules();
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->bootModules();
    }

    /**
     * Register module configurations.
     */
    protected function registerModules(): void
    {
        $modules = config('modules.modules', []);

        foreach ($modules as $module) {
            $this->registerModuleConfig($module);
        }
    }

    /**
     * Boot modules.
     */
    protected function bootModules(): void
    {
        $modules = config('modules.modules', []);

        foreach ($modules as $module) {
            $this->bootModuleRoutes($module);
            $this->bootModuleMigrations($module);
            $this->bootModuleViews($module);
            $this->bootModuleTranslations($module);
        }
    }

    /**
     * Register module configuration.
     */
    protected function registerModuleConfig(string $module): void
    {
        $configPath = $this->getModulePath($module) . '/config';

        if (File::isDirectory($configPath)) {
            foreach (File::files($configPath) as $file) {
                $configName = $file->getFilenameWithoutExtension();
                $this->mergeConfigFrom($file->getPathname(), $configName);
            }
        }
    }

    /**
     * Boot module routes.
     */
    protected function bootModuleRoutes(string $module): void
    {
        $routesPath = $this->getModulePath($module) . '/routes';

        if (File::isDirectory($routesPath)) {
            foreach (File::files($routesPath) as $file) {
                $routeType = $file->getFilenameWithoutExtension();

                switch ($routeType) {
                    case 'api':
                        Route::middleware('api')
                            ->prefix('api')
                            ->group($file->getPathname());
                        break;

                    case 'web':
                        Route::middleware('web')
                            ->group($file->getPathname());
                        break;

                    case 'public':
                        Route::middleware('api')
                            ->prefix('api/public')
                            ->group($file->getPathname());
                        break;

                    default:
                        Route::middleware('api')
                            ->group($file->getPathname());
                        break;
                }
            }
        }
    }

    /**
     * Boot module migrations.
     */
    protected function bootModuleMigrations(string $module): void
    {
        $migrationsPath = $this->getModulePath($module) . '/Database/Migrations';

        if (File::isDirectory($migrationsPath)) {
            $this->loadMigrationsFrom($migrationsPath);
        }
    }

    /**
     * Boot module views.
     */
    protected function bootModuleViews(string $module): void
    {
        $viewsPath = $this->getModulePath($module) . '/Resources/views';

        if (File::isDirectory($viewsPath)) {
            $this->loadViewsFrom($viewsPath, strtolower($module));
        }
    }

    /**
     * Boot module translations.
     */
    protected function bootModuleTranslations(string $module): void
    {
        $translationsPath = $this->getModulePath($module) . '/Resources/lang';

        if (File::isDirectory($translationsPath)) {
            $this->loadTranslationsFrom($translationsPath, strtolower($module));
        }
    }

    /**
     * Get module path.
     */
    protected function getModulePath(string $module): string
    {
        return config('modules.path') . '/' . $module;
    }
}
