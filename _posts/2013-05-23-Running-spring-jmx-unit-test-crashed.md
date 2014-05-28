---
layout: blog
title: Spring 进行JMX单元测试报错
---

背景：多个Junit单元测试，使用Spring test一次全跑，报错，报错内容是JMX环境被多次加载（javax.management.InstanceAlreadyExistsException）。

Spring文档指出：

>Consider the scenario where a Spring MBeanExporter attempts to register an MBean with an MBeanServer using the ObjectName 'bean:name=testBean1'. If an MBean instance has already been registered under that same ObjectName, the default behavior is to fail (and throw an InstanceAlreadyExistsException).
>It is possible to control the behavior of exactly what happens when an MBean is registered with an MBeanServer. Spring's JMX support allows for three different registration behaviors to control the registration behavior when the registration process finds that an MBean has already been registered under the same ObjectName; these registration behaviors are summarized on the following table:
Table 20.1. Registration Behaviors
Registration behavior Explanation

>| Value        | Descriptionn           |
| ------------- | ------------- |
| REGISTRATION_FAIL_ON_EXISTING | This is the default registration behavior. If an MBean instance has already been registered under the same ObjectName, the MBean that is being registered will not be registered and anInstanceAlreadyExistsException will be thrown. The existing MBean is unaffected. |
| REGISTRATION_IGNORE_EXISTING | If an MBean instance has already been registered under the same ObjectName, the MBean that is being registered will not be registered. The existing MBean is unaffected, and no Exception will be thrown.<br/>This is useful in settings where multiple applications want to share a common MBean in a shared MBeanServer. |
| REGISTRATION_REPLACE_EXISTING | If an MBean instance has already been registered under the same ObjectName, the existing MBean that was previously registered will be unregistered and the new MBean will be registered in it's place (the new MBeaneffectively replaces the previous instance). |

><br/>
>The above values are defined as constants on the MBeanRegistrationSupport class (the MBeanExporter class derives from this superclass). If you want to change the default registration behavior, you simply need to set the value of theregistrationBehaviorName property on your MBeanExporter definition to one of those values.
The following example illustrates how to effect a change from the default registration behavior to the REGISTRATION_REPLACE_EXISTING behavior:

>{% highlight xml %}
<beans>
    <bean id="exporter" class="org.springframework.jmx.export.MBeanExporter">
        <property name="beans">
            <map>
                <entry key="bean:name=testBean1" value-ref="testBean"/>
            </map>
        </property>
        <property name="registrationBehaviorName" value="REGISTRATION_REPLACE_EXISTING"/>
    </bean>
    <bean id="testBean" class="org.springframework.jmx.JmxTestBean">
        <property name="name" value="TEST"/>
        <property name="age" value="100"/>
    </bean>
</beans>
{% endhighlight %}
