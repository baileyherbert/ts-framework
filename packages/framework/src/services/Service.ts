import { resolver } from '@baileyherbert/container';
import { Promisable } from '@baileyherbert/types';
import { Application } from '../application/Application';
import { BaseModule, Module } from '../main';
import { normalizeLogLevel } from '../utilities/normalizers';
import { ServiceOptions } from './ServiceOptions';

export abstract class Service<T extends BaseModule = BaseModule> {

	/**
	 * The dependency injection container for the parent application.
	 */
	public readonly container = resolver.getConstructorInstance();

	/**
	 * The application that this service is attached to.
	 */
	public readonly application = this.container.resolve(Application);

	/**
	 * The module that this service belongs to.
	 */
	public readonly module = this.application.services.getParentModule(this) as T;

	/**
	 * The logger for this service.
	 */
	public readonly logger = this.module.logger.createChild(this.constructor.name);

	/**
	 * The options for this service.
	 */
	public readonly options: ServiceOptions;

	/**
	 * Constructs a new `Service` instance with the given options.
	 * @param options
	 */
	public constructor(options: ServiceOptions = {}) {
		this.options = options;
		this.logger.level = normalizeLogLevel(options.logging);
	}

	/**
	 * Starts the service.
	 */
	protected abstract start(): Promisable<void>;

	/**
	 * Stops the service.
	 */
	protected abstract stop(): Promisable<void>;

	/**
	 * Starts the service externally.
	 * @internal
	 */
	public async __internStart() {
		await this.start();
	}

	/**
	 * Stops the service externally.
	 * @internal
	 */
	public async __internStop() {
		await this.stop();
	}

	/**
	 * Invoked immediately before the first service in the module is started.
	 */
	protected beforeModuleBoot(): Promise<void> | void {

	}

	/**
	 * Invoked after all services in the module have started.
	 */
	protected onModuleBoot(): Promise<void> | void {

	}

	/**
	 * Invoked immediately before the first service in the module is stopped.
	 */
	protected beforeModuleShutdown(): Promise<void> | void {

	}

	/**
	 * Invoked after all services in the module have shut down.
	 */
	protected onModuleShutdown(): Promise<void> | void {

	}

}