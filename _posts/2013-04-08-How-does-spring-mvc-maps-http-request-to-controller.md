---
layout: blog
title: Spring MVC 如何将RequestMapping Annotation 转为Url映射的
---

 本来是想研究Annotation的，Java有APT，但是感觉Spring用的肯定不是APT，就顺手看了Spring MVC处理annotation的处理过程，从RequestMapping开始入手，大致分享一下Spring处理Annotation的过程。其他大致也差不多吧（我猜想）。

Spring被加载时通过AbstractDetectingUrlHandlerMapping.java

{% highlight java %}
/**
 * Calls the {@link #detectHandlers()} method in addition to the
 * superclass's initialization.
 */  
@Override  
public void initApplicationContext() throws ApplicationContextException {  
    super.initApplicationContext();  
    detectHandlers();  
}  

/**
 * Register all handlers found in the current ApplicationContext.
 * <p>The actual URL determination for a handler is up to the concrete
 * {@link #determineUrlsForHandler(String)} implementation. A bean for
 * which no such URLs could be determined is simply not considered a handler.
 * @throws org.springframework.beans.BeansException if the handler couldn't be registered
 * @see #determineUrlsForHandler(String)
 */  
protected void detectHandlers() throws BeansException {  
    if (logger.isDebugEnabled()) {  
        logger.debug("Looking for URL mappings in application context: " + getApplicationContext());  
    }  
    String[] beanNames = (this.detectHandlersInAncestorContexts ?  
            BeanFactoryUtils.beanNamesForTypeIncludingAncestors(getApplicationContext(), Object.class) :  
            getApplicationContext().getBeanNamesForType(Object.class));  

    // Take any bean name that we can determine URLs for.  
    for (String beanName : beanNames) {  
        String[] urls = determineUrlsForHandler(beanName);  
        if (!ObjectUtils.isEmpty(urls)) {  
            // URL paths found: Let's consider it a handler.  
            registerHandler(urls, beanName);  
        }  
        else {  
            if (logger.isDebugEnabled()) {  
                logger.debug("Rejected bean name '" + beanName + "': no URL paths identified");  
            }  
        }  
    }  
}  
{% endhighlight %}

 启动RequestMapping的分析和注册,主要看detectHandlers方法，其从Spring容器中获得了所有的Bean，然后读取其上的RequestMapping Annotation

{% highlight java %}
/**
     * Checks for presence of the {@link org.springframework.web.bind.annotation.RequestMapping}
     * annotation on the handler class and on any of its methods.
     */  
    @Override  
    protected String[] determineUrlsForHandler(String beanName) {  
        ApplicationContext context = getApplicationContext();  
        Class<?> handlerType = context.getType(beanName);  
        RequestMapping mapping = context.findAnnotationOnBean(beanName, RequestMapping.class);  
        if (mapping != null) {  
            // @RequestMapping found at type level  
            this.cachedMappings.put(handlerType, mapping);  
            Set<String> urls = new LinkedHashSet<String>();  
            String[] typeLevelPatterns = mapping.value();  
            if (typeLevelPatterns.length > 0) {  
                // @RequestMapping specifies paths at type level  
                String[] methodLevelPatterns = determineUrlsForHandlerMethods(handlerType, true);  
                for (String typeLevelPattern : typeLevelPatterns) {  
                    if (!typeLevelPattern.startsWith("/")) {  
                        typeLevelPattern = "/" + typeLevelPattern;  
                    }  
                    boolean hasEmptyMethodLevelMappings = false;  
                    for (String methodLevelPattern : methodLevelPatterns) {  
                        if (methodLevelPattern == null) {  
                            hasEmptyMethodLevelMappings = true;  
                        }  
                        else {  
                            String combinedPattern = getPathMatcher().combine(typeLevelPattern, methodLevelPattern);  
                            addUrlsForPath(urls, combinedPattern);  
                        }  
                    }  
                    if (hasEmptyMethodLevelMappings ||  
                            org.springframework.web.servlet.mvc.Controller.class.isAssignableFrom(handlerType)) {  
                        addUrlsForPath(urls, typeLevelPattern);  
                    }  
                }  
                return StringUtils.toStringArray(urls);  
            }  
            else {  
                // actual paths specified by @RequestMapping at method level  
                return determineUrlsForHandlerMethods(handlerType, false);  
            }  
        }  
        else if (AnnotationUtils.findAnnotation(handlerType, Controller.class) != null) {  
            // @RequestMapping to be introspected at method level  
            return determineUrlsForHandlerMethods(handlerType, false);  
        }  
        else {  
            return null;  
        }  
    }
{% endhighlight %}

 就这样，RequestMapping Annotation的值就被拿到了，当然拿不到的说明不是Controller吧。其中还有对方法上的RequestMapping的获得。
我们可以看到，在RequestMapping里的value，第一个“/”是可选的，因为这里做了判断。（当然，用过的人已经知道了）.
接下来就是注册了，其实就是放在了

{% highlight java %}
private final Map<String, Object> handlerMap = new LinkedHashMap<String, Object>();

/**
     * Register the specified handler for the given URL paths.
     * @param urlPaths the URLs that the bean should be mapped to
     * @param beanName the name of the handler bean
     * @throws BeansException if the handler couldn't be registered
     * @throws IllegalStateException if there is a conflicting handler registered
     */  
    protected void registerHandler(String[] urlPaths, String beanName) throws BeansException, IllegalStateException {  
        Assert.notNull(urlPaths, "URL path array must not be null");  
        for (String urlPath : urlPaths) {  
            registerHandler(urlPath, beanName);  
        }  
    }  

    /**
     * Register the specified handler for the given URL path.
     * @param urlPath the URL the bean should be mapped to
     * @param handler the handler instance or handler bean name String
     * (a bean name will automatically be resolved into the corresponding handler bean)
     * @throws BeansException if the handler couldn't be registered
     * @throws IllegalStateException if there is a conflicting handler registered
     */  
    protected void registerHandler(String urlPath, Object handler) throws BeansException, IllegalStateException {  
        Assert.notNull(urlPath, "URL path must not be null");  
        Assert.notNull(handler, "Handler object must not be null");  
        Object resolvedHandler = handler;  

        // Eagerly resolve handler if referencing singleton via name.  
        if (!this.lazyInitHandlers && handler instanceof String) {  
            String handlerName = (String) handler;  
            if (getApplicationContext().isSingleton(handlerName)) {  
                resolvedHandler = getApplicationContext().getBean(handlerName);  
            }  
        }  

        Object mappedHandler = this.handlerMap.get(urlPath);  
        if (mappedHandler != null) {  
            if (mappedHandler != resolvedHandler) {  
                throw new IllegalStateException(  
                        "Cannot map " + getHandlerDescription(handler) + " to URL path [" + urlPath +  
                        "]: There is already " + getHandlerDescription(mappedHandler) + " mapped.");  
            }  
        }  
        else {  
            if (urlPath.equals("/")) {  
                if (logger.isInfoEnabled()) {  
                    logger.info("Root mapping to " + getHandlerDescription(handler));  
                }  
                setRootHandler(resolvedHandler);  
            }  
            else if (urlPath.equals("/*")) {  
                if (logger.isInfoEnabled()) {  
                    logger.info("Default mapping to " + getHandlerDescription(handler));  
                }  
                setDefaultHandler(resolvedHandler);  
            }  
            else {  
                this.handlerMap.put(urlPath, resolvedHandler);  
                if (logger.isInfoEnabled()) {  
                    logger.info("Mapped URL path [" + urlPath + "] onto " + getHandlerDescription(handler));  
                }  
            }  
        }  
    }  
{% endhighlight %}
至此，RequestMapping就将Url和Bean联系起来了。
之后会更进一步学习Spring源码，欢迎支出错误和提出意见
