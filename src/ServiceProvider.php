<?php

namespace Infofactory\BardMultipromptAi;

use Statamic\Facades\CP\Nav;
use Statamic\Facades\Permission;
use Statamic\Providers\AddonServiceProvider;

class ServiceProvider extends AddonServiceProvider
{
    protected $vite = [
        'input' => [
            'resources/js/addon.js',
        ],
        'publicDirectory' => 'resources/dist',
    ];

    public function bootAddon()
    {
        // Register permissions
        Permission::register('manage bard-multiprompt-ai config')
            ->label('Manage Bard AI Configs');

        // Register navigation
        Nav::extend(function ($nav) {
            $nav->content(__('bard-multiprompt-ai::cp.title'))
                ->section('Tools')
                ->icon('<svg version="1.1" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="m55.906 16.906a5.2 5.2 0 0 0-5.2031 5.2031v23.859h-23.859a5.2 5.2 0 0 0-5.2031 5.2031 5.2 5.2 0 0 0 5.2031 5.2031h23.859v23.859a5.2 5.2 0 0 0 5.2031 5.2031 5.2 5.2 0 0 0 5.2031-5.2031v-23.859h23.859a5.2 5.2 0 0 0 5.2031-5.2031 5.2 5.2 0 0 0-5.2031-5.2031h-23.859v-23.859a5.2 5.2 0 0 0-5.2031-5.2031zm129.95 0.03125c-3.8218 0-7.647 1.4439-10.531 4.3281l-168.7 168.7c-5.7684 5.7684-5.7684 15.294 0 21.062l25.047 25.047c5.7684 5.7684 15.278 5.7684 21.047 0l123.3-123.3a5.2 5.2 0 0 0 0.1875-0.20313l45.219-45.203c5.7684-5.7684 5.7684-15.294 0-21.062l-25.047-25.047c-2.8842-2.8842-6.6938-4.3281-10.516-4.3281zm0 10.328c1.1314-1e-6 2.2611 0.4486 3.1719 1.3594l25.047 25.047c1.8216 1.8216 1.8216 4.5222 0 6.3438l-41.922 41.922-31.406-31.375 41.938-41.938c0.91078-0.91078 2.0404-1.3594 3.1719-1.3594zm-52.453 50.641 31.391 31.391-119.42 119.42c-1.8216 1.8216-4.5222 1.8216-6.3438 0l-25.047-25.047c-1.8216-1.8216-1.8216-4.5222 0-6.3438l119.42-119.42zm87.188 45.562a5.2 5.2 0 0 0-5.2031 5.2031v23.859h-23.859a5.2 5.2 0 0 0-5.2031 5.2031 5.2 5.2 0 0 0 5.2031 5.2031h23.859v23.859a5.2 5.2 0 0 0 5.2031 5.2031 5.2 5.2 0 0 0 5.2031-5.2031v-23.859h23.859a5.2 5.2 0 0 0 5.2031-5.2031 5.2 5.2 0 0 0-5.2031-5.2031h-23.859v-23.859a5.2 5.2 0 0 0-5.2031-5.2031zm-58.125 67.828a5.2 5.2 0 0 0-5.2031 5.1875v14.188h-14.172a5.2 5.2 0 0 0-5.2031 5.1875 5.2 5.2 0 0 0 5.2031 5.2031h14.172v14.172a5.2 5.2 0 0 0 5.2031 5.2031 5.2 5.2 0 0 0 5.2031-5.2031v-14.172h14.172a5.2 5.2 0 0 0 5.2031-5.2031 5.2 5.2 0 0 0-5.2031-5.1875h-14.172v-14.188a5.2 5.2 0 0 0-5.2031-5.1875z" fill="currentColor"/></svg>')
                ->route('bard-multiprompt-ai.config')
                ->can('manage bard-multiprompt-ai config');
        });
    }
}
